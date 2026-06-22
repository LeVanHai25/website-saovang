/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Application URL Query Router
   ════════════════════════════════════════════════════════════════ */

export const appRouter = {
  getQueryParams() {
    const params = {};
    const search = window.location.search;
    if (search) {
      const parts = search.slice(1).split('&');
      parts.forEach(part => {
        const [key, value] = part.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    return params;
  },

  setQueryParam(key, value) {
    const params = this.getQueryParams();
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    
    const query = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
      
    const newUrl = `${window.location.pathname}${query ? '?' + query : ''}${window.location.hash}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
};
