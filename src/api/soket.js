const ws = new WebSocket('ws://127.0.0.1:8000/location/ws');

ws.onopen = () => {
    console.log('✅ החיבור ל-WebSocket הצליח!');
    ws.send(JSON.stringify({ lat: 32.0853, lng: 34.7818 }));
  }  ;

