export function initWebsocket(config = {
    url: '',
    onopen: ()=>{},
    onerror: ()=>{},
    onmessage: ()=>{},
    onclose: ()=>{}
}) {
    const url = 'ws://' + require('@/assets/data.json').url + ':8080';
    const websocket = new WebSocket(url + config.url);
    websocket.onopen = config.onopen;
    websocket.onerror = config.onerror;
    websocket.onmessage = config.onmessage;
    websocket.onclose = config.onclose;
    return websocket;
}