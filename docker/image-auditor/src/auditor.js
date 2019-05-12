const protocol = require('./protocol');

const dgram = require('dgram');

const socket = dgram.createSocket('udp4');

const moment = require('moment');

const net = require('net');

socket.bind(protocol.PROTOCOL_PORT,function () {
    console.log("joining multicast group");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADRESS);

});

const activeMusician = new Map();

socket.on('message',function (msg,source) {

    console.log("Data has arrived: "+ msg + "source port "+ source.port);



const musician = JSON.parse(msg);

if ((!activeMusician.has(musician.uuid))){

    activeMusician.set(musician.uuid,{
        instrument:musician.instrument,
        activeSince:moment().toISOString(),
        activeLast: moment().unix(),
        sourcePort:source.port,
    });}
    else {
    activeMusician.get(musician.uuid).activeLast = moment().unix();
}
});

    const server = net.createServer();

    server.listen(protocol.PROTOCOL_PORT);


    function display() {

        const musicianSummary = [];

        activeMusician.forEach((element,key)=>{

            if(moment().unix-element.activeLast >5){
                activeMusician.delete(key);
            }else{
                musicianSummary.push({

                    uuid:key,instrument: element.instrument,activeSince: element.activeSince,


                });

            }

        });

        return musicianSummary;
    }

    server.on('connection',function (tcpSocket) {

        const payload = JSON.stringify(display(),null,4);

        tcpSocket.write(payload);
        tcpSocket.end('\r\n');

    });
