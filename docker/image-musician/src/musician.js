//define multicast and port in separate file
const protocol = require('./protocol');

//UDP module
const dgram = require('dgram');

//datagram socket
const socket = dgram.createSocket('udp4');

const uuid = require('uuid/v4');

const sounds = {

    piano : 'ti-ta-ti',
    trumpet : 'pouet',
    flute : 'trulu',
    violin : 'gzi-gzi',
    drum : 'boum-boum',
};

function Musician(instrument){

    this.instrument = instrument;
    this.sound = sounds[instrument];
    this.uuid = uuid4();




    Musician.prototype.play = function () {

        const music = {
            uuid: this.uuid,
            instrument : instrument,
            sound : this.sound,
        };

        const payload = Buffer.from(JSON.stringify(music));

        //message = new Buffer(payload);
        socket.send(payload, 0, payload.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADRESS, () => {
            console.log("sending paylod: " + payload + "via port" + socket.address().port);
        });
    }

    setInterval(this.play.bind(this),1000)

}

instrument = process.argv[2];

const musician = new Musician(instrument);




