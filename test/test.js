/* eslint-disable no-console */
'use strict'; 
const RFM69 = require('../index');
const rfm69 = new RFM69(); 

rfm69.initialize({
  address: 1,
  //encryptionKey: '0123456789abcdef',
  verbose:false,
  initializedCallback: initializedCallback,
});

function initializedCallback() {
  console.log('Initialized');
  rfm69.registerPacketReceivedCallback(packetReceivedCallback1);
  rfm69.registerPacketReceivedCallback(packetReceivedCallback2);
  rfm69.readTemperature((temp) => {
    console.log('Temp: ', temp);
    rfm69.calibrateRadio(()=>{});
  });

  setInterval(function() {
    const toAddress=2;
    console.log(`${formatDatetime(new Date())} Sending packet to address ${toAddress} [${rfm69.modeName}]`);
    rfm69.send({
      toAddress: toAddress, payload: `Hello ${timeStamp()}`, attempts: 3, requireAck: true, ackCallback: function(err, res) {
        if (err){
          console.log(err)
        }else
        {
          console.log("Packet send successful on attempt:",res);
        }
      },
    });
  }, 3000);

  
  setTimeout(
    function() {rfm69.broadcast('Broadcast!!',function(){
      console.log("Sent broadcast")
    });}
    ,2000
  );
  /*
  setInterval(function() {
    const toAddress=2;
    console.log(`Sending packet to address ${toAddress}`);
    rfm69.send({
      toAddress: toAddress, payload: 'hello', ackCallback: function(err, res) {
        if (err){
          console.log(err)
        }else
        {
          console.log("Packet send successful on attempt:",res);
        }
      },
    });
  }, 4000);
  */
}

function packetReceivedCallback1(packet) {
    console.log(`Packet received (callback1) from peer address '${packet.senderAddress}': ${packet.payloadString}`);
}
function packetReceivedCallback2(packet) {
  console.log(`Packet received (callback2) from peer address '${packet.senderAddress}': ${packet.payloadString}`);
}

process.on('SIGINT', () => {
  rfm69.shutdown();
});


function timeStamp() {
  const m=new Date();
  return ('0' + m.getUTCMinutes()).slice(-2) + ':' +
    ('0' + m.getUTCSeconds()).slice(-2) + '.' +
    m.getUTCMilliseconds();
}

function formatDatetime(m) {
  //return ""
  return ('0' + m.getUTCHours()).slice(-2) + ':' +
    ('0' + m.getUTCMinutes()).slice(-2) + ':' +
    ('0' + m.getUTCSeconds()).slice(-2) + '.' +
    m.getUTCMilliseconds();
}
