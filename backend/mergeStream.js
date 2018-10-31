const { Readable } = require('stream');
const kSource = Symbol('source');

class MergeStream extends Readable {
  constructor(streams, options) {
    super(options);
    this.streams = streams;
  }

  /*
  _write(chunk, encoding, callback) {
    // The underlying source only deals with strings
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
      console.log(`writing chunk: ${chunk}`);
    // this[kSource].writeSomeData(chunk);
    callback();
  }
  */

  _read(size) {
    console.log(`read called with size ${size}`);
    for (let i = 0; i < this.streams.length; i++) {
      const currentStream = this.streams[i];
      let chunk = currentStream.read();
      if (Buffer.isBuffer(chunk)) {
        chunk = chunk.toString();
        console.log(`chunk for stream ${i}: ${chunk}`);
      }
    }
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
