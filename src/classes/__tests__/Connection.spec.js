import {Connection} from '../Connection';
import {ATYP_V4, ATYP_V6, ATYP_DOMAIN} from '../../socks5/Constants';

describe('Connection#constructor', function () {
  it('should throw when ATYP is not v4, v6 or domain', function () {
    expect(() => new Connection({ATYP: null})).toThrow();
  });

  it('should throw when DSTADDR is not Array or Buffer', function () {
    expect(() => new Connection({DSTADDR: null})).toThrow();
  });

  it('should throw when v4 DSTADDR.length is not 4', function () {
    expect(() => new Connection({ATYP: ATYP_V4, DSTADDR: []})).toThrow();
  });

  it('should throw when v6 DSTADDR.length is not 16', function () {
    expect(() => new Connection({ATYP: ATYP_V6, DSTADDR: []})).toThrow();
  });

  it('should throw when ATYP is not v4, v6 or domain', function () {
    expect(() => new Connection({ATYP: null})).toThrow();
  });

  it('should throw when DSTPORT is not Array or Buffer', function () {
    expect(() => new Connection({DSTPORT: null})).toThrow();
  });

  it('should throw when DSTADDR.length is not 2', function () {
    expect(() => new Connection({DSTPORT: [1, 2, 3]})).toThrow();
  });
});

describe('Connection#getEndPoint', function () {
  it('should throw when ATYP is invalid', function () {
    expect(() => {
      const conn = new Connection();
      conn.ATYP = null;
      conn.getEndPoint();
    }).toThrow();
  });
});

describe('Connection#toString', function () {
  it('should return ipv4 address', function () {
    const conn = new Connection();
    expect(conn.toString()).toBe('0.0.0.0:0');
  });

  it('should return ipv6 address', function () {
    const conn = new Connection({
      ATYP: ATYP_V6,
      DSTADDR: [0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff]
    });
    expect(conn.toString()).toBe('[ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff]:0');
  });

  it('should return domain address', function () {
    const conn = new Connection({
      ATYP: ATYP_DOMAIN,
      DSTADDR: Buffer.from([97, 98, 99, 46, 99, 111, 109]),
      DSTPORT: [0x00, 0x50]
    });
    expect(conn.toString()).toBe('abc.com:80');
  });
});
