/**
 * Tầng giao tiếp với API giá xăng.
 * File này chỉ có nhiệm vụ gọi API và chuẩn hóa dữ liệu, không thao tác DOM.
 */
(function (global) {
  'use strict';

  const API_BASE_URL = 'https://giaxanghomnay.com/api/pvdate';
  const REQUEST_TIMEOUT_MS = 10000;

  // Các loại nhiên liệu được hiển thị trên giao diện.
  // Giá ưu tiên lấy ở zone1_price (Vùng 1 — Hà Nội, TP.HCM).
  const FUEL_CONFIG = [
    { title: 'Xăng E10 RON 95-III', icon: '⛽' },
    { title: 'Xăng E5 RON 92-II', icon: '🔥' },
    { title: 'DO 0,05S-II', icon: '🪣' },
  ];

  function getLocalDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseFuelData(data, requestedDate) {
    if (!Array.isArray(data)) return [];

    const allItems = data.flatMap(group => Array.isArray(group) ? group : [group]);

    return FUEL_CONFIG.flatMap(config => {
      const matches = allItems.filter(item =>
        item?.title?.trim() === config.title
      );
      const bestMatch = matches.find(item =>
        item.date?.startsWith(requestedDate)
      ) || matches[0];
      const price = bestMatch?.zone1_price ?? bestMatch?.price;

      if (!Number.isFinite(Number(price)) || Number(price) <= 0) return [];

      return [{
        name: config.title,
        price: Math.round(Number(price)),
        icon: config.icon,
      }];
    });
  }

  async function fetchFuelPrices(date = new Date()) {
    const requestedDate = getLocalDate(date);
    const response = await fetch(`${API_BASE_URL}/${requestedDate}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`API giá xăng trả về HTTP ${response.status}`);
    }

    const data = await response.json();
    const fuels = parseFuelData(data, requestedDate);

    if (!fuels.length) {
      throw new Error('Không tìm thấy loại xăng phù hợp trong dữ liệu API');
    }

    return { fuels, requestedDate };
  }

  global.FuelApi = Object.freeze({
    fetchFuelPrices,
    getLocalDate,
    parseFuelData,
  });
})(window);
