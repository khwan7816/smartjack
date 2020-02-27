'use strict';

const ajax = (() => {
  const request = ({
    url,
    method,
    data,
    reqContentType,
    success,
    error,
    async = true
  }) => {
    const xhr = new XMLHttpRequest();
    method = method.toUpperCase();
    data = typeof data === 'object' ? JSON.stringify(data) : data;

    xhr.open(method, url, async);
    reqContentType && xhr.setRequestHeader('Content-Type', reqContentType);

    // xhr.onload = () => {
    xhr.onreadystatechange = () => {
      // 예외 처리
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status !== 200) {
        error && error(xhr);
        return;
      }

      // 응답데이터 처리
      const type = xhr.getResponseHeader('Content-Type');
      let resData = null;

      if (type.match(/^text/)) {
        resData = xhr.responseText;
      } else if (type.match(/^application\/json/)) {
        resData = JSON.parse(xhr.responseText);
      } else {
        throw new Error(type + '타입은 사용할 수 없습니다');
      }

      // 성공 콜백
      success && success(resData);
    };

    xhr.send(data);
  };

  return {
    get({ url, data, success, error, async }) {
      request({
        url,
        method: 'GET',
        data,
        success,
        error,
        async
      });
    },
    post({ url, data, success, error, async }) {
      request({
        url,
        method: 'POST',
        data,
        reqContentType: 'application/json',
        success,
        error,
        async
      });
    }
  };
})();
