const { Readable } = require('stream');
const kSource = Symbol('source');

class MergeStream extends Readable {
  constructor(streams, bufferSize, options) {
    super(options);
    this.streams = streams;
    this.buffer = [bufferSize];

    this.setupStreamEvents();
  }

  setupStreamEvents() {
    for (let i = 0; i < this.streams.length; i++) {
      const currentStream = this.streams[i];
      currentStream.on('readable', this.handleIncomingData)
    }
  }

  handleIncomingData() {
    let data;

    while (data = this.read()) {
      data = JSON.parse(data);
      console.log(`writing chunk from ${data.id}`);
    }
  }


  // on data, get data, add to buffer, check if newest item is available, stream


  _read(size) {
    /*
    console.log(`read called with size ${size}`);
    for (let i = 0; i < this.streams.length; i++) {
      const currentStream = this.streams[i];
      let chunk = currentStream.read();
      if (Buffer.isBuffer(chunk)) {
        chunk = chunk.toString();
        console.log(`chunk for stream ${i}: ${chunk}`);
      }
    }
    */
    /*
    //this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
      console.log(`reading buffer: ${Buffer.from(data, encoding)}`);
    });
    */
  }
}

module.exports = {
  MergeStream
};
