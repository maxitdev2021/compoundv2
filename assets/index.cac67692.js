import { B as J, a as Tt, E as Dt } from "./main.3b3cef45.js";
import {
  E as le,
  _ as f,
  c as q,
  d as ke,
  y as Nt,
} from "./hooks.module.6a16c9d0.js";
function Ot(t) {
  return (
    t instanceof Uint8Array ||
    (ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array")
  );
}
function Ee(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function j(t, ...e) {
  if (!Ot(t)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error(
      "Uint8Array expected of length " + e + ", got length=" + t.length
    );
}
function X(t, e = !0) {
  if (t.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function Fe(t, e) {
  j(t);
  const s = e.outputLen;
  if (t.length < s)
    throw new Error(
      "digestInto() expects output buffer of length at least " + s
    );
}
function Ut(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function z(...t) {
  for (let e = 0; e < t.length; e++) t[e].fill(0);
}
function ie(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function k(t, e) {
  return (t << (32 - e)) | (t >>> e);
}
const jt = (() =>
  new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function Ht(t) {
  return (
    ((t << 24) & 4278190080) |
    ((t << 8) & 16711680) |
    ((t >>> 8) & 65280) |
    ((t >>> 24) & 255)
  );
}
function Bt(t) {
  for (let e = 0; e < t.length; e++) t[e] = Ht(t[e]);
  return t;
}
const Ce = jt ? (t) => t : Bt,
  Wt = (() =>
    typeof Uint8Array.from([]).toHex == "function" &&
    typeof Uint8Array.fromHex == "function")(),
  qt = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Kt(t) {
  if ((j(t), Wt)) return t.toHex();
  let e = "";
  for (let s = 0; s < t.length; s++) e += qt[t[s]];
  return e;
}
function Vt(t) {
  if (typeof t != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ee(t) {
  return typeof t == "string" && (t = Vt(t)), j(t), t;
}
class ze {}
function Ze(t) {
  const e = (n) => t().update(ee(n)).digest(),
    s = t();
  return (
    (e.outputLen = s.outputLen),
    (e.blockLen = s.blockLen),
    (e.create = () => t()),
    e
  );
}
function Ft(t) {
  const e = (n, i) => t(i).update(ee(n)).digest(),
    s = t({});
  return (
    (e.outputLen = s.outputLen),
    (e.blockLen = s.blockLen),
    (e.create = (n) => t(n)),
    e
  );
}
function zt(t, e, s, n) {
  if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, s, n);
  const i = BigInt(32),
    r = BigInt(4294967295),
    a = Number((s >> i) & r),
    o = Number(s & r),
    c = n ? 4 : 0,
    d = n ? 0 : 4;
  t.setUint32(e + c, a, n), t.setUint32(e + d, o, n);
}
function Zt(t, e, s) {
  return (t & e) ^ (~t & s);
}
function Gt(t, e, s) {
  return (t & e) ^ (t & s) ^ (e & s);
}
class $t extends ze {
  constructor(e, s, n, i) {
    super(),
      (this.finished = !1),
      (this.length = 0),
      (this.pos = 0),
      (this.destroyed = !1),
      (this.blockLen = e),
      (this.outputLen = s),
      (this.padOffset = n),
      (this.isLE = i),
      (this.buffer = new Uint8Array(e)),
      (this.view = ie(this.buffer));
  }
  update(e) {
    X(this), (e = ee(e)), j(e);
    const { view: s, buffer: n, blockLen: i } = this,
      r = e.length;
    for (let a = 0; a < r; ) {
      const o = Math.min(i - this.pos, r - a);
      if (o === i) {
        const c = ie(e);
        for (; i <= r - a; a += i) this.process(c, a);
        continue;
      }
      n.set(e.subarray(a, a + o), this.pos),
        (this.pos += o),
        (a += o),
        this.pos === i && (this.process(s, 0), (this.pos = 0));
    }
    return (this.length += e.length), this.roundClean(), this;
  }
  digestInto(e) {
    X(this), Fe(e, this), (this.finished = !0);
    const { buffer: s, view: n, blockLen: i, isLE: r } = this;
    let { pos: a } = this;
    (s[a++] = 128),
      z(this.buffer.subarray(a)),
      this.padOffset > i - a && (this.process(n, 0), (a = 0));
    for (let l = a; l < i; l++) s[l] = 0;
    zt(n, i - 8, BigInt(this.length * 8), r), this.process(n, 0);
    const o = ie(e),
      c = this.outputLen;
    if (c % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4,
      h = this.get();
    if (d > h.length) throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < d; l++) o.setUint32(4 * l, h[l], r);
  }
  digest() {
    const { buffer: e, outputLen: s } = this;
    this.digestInto(e);
    const n = e.slice(0, s);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const {
      blockLen: s,
      buffer: n,
      length: i,
      finished: r,
      destroyed: a,
      pos: o,
    } = this;
    return (
      (e.destroyed = a),
      (e.finished = r),
      (e.length = i),
      (e.pos = o),
      i % s && e.buffer.set(n),
      e
    );
  }
  clone() {
    return this._cloneInto();
  }
}
const _ = Uint32Array.from([
  1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
  528734635, 1541459225,
]);
const $ = BigInt(2 ** 32 - 1),
  Ie = BigInt(32);
function Yt(t, e = !1) {
  return e
    ? { h: Number(t & $), l: Number((t >> Ie) & $) }
    : { h: Number((t >> Ie) & $) | 0, l: Number(t & $) | 0 };
}
function Jt(t, e = !1) {
  const s = t.length;
  let n = new Uint32Array(s),
    i = new Uint32Array(s);
  for (let r = 0; r < s; r++) {
    const { h: a, l: o } = Yt(t[r], e);
    [n[r], i[r]] = [a, o];
  }
  return [n, i];
}
const Qt = (t, e, s) => (t << s) | (e >>> (32 - s)),
  Xt = (t, e, s) => (e << s) | (t >>> (32 - s)),
  es = (t, e, s) => (e << (s - 32)) | (t >>> (64 - s)),
  ts = (t, e, s) => (t << (s - 32)) | (e >>> (64 - s));
const ss = BigInt(0),
  B = BigInt(1),
  ns = BigInt(2),
  is = BigInt(7),
  rs = BigInt(256),
  as = BigInt(113),
  Ge = [],
  $e = [],
  Ye = [];
for (let t = 0, e = B, s = 1, n = 0; t < 24; t++) {
  ([s, n] = [n, (2 * s + 3 * n) % 5]),
    Ge.push(2 * (5 * n + s)),
    $e.push((((t + 1) * (t + 2)) / 2) % 64);
  let i = ss;
  for (let r = 0; r < 7; r++)
    (e = ((e << B) ^ ((e >> is) * as)) % rs),
      e & ns && (i ^= B << ((B << BigInt(r)) - B));
  Ye.push(i);
}
const Je = Jt(Ye, !0),
  os = Je[0],
  cs = Je[1],
  Se = (t, e, s) => (s > 32 ? es(t, e, s) : Qt(t, e, s)),
  Ae = (t, e, s) => (s > 32 ? ts(t, e, s) : Xt(t, e, s));
function Qe(t, e = 24) {
  const s = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let a = 0; a < 10; a++)
      s[a] = t[a] ^ t[a + 10] ^ t[a + 20] ^ t[a + 30] ^ t[a + 40];
    for (let a = 0; a < 10; a += 2) {
      const o = (a + 8) % 10,
        c = (a + 2) % 10,
        d = s[c],
        h = s[c + 1],
        l = Se(d, h, 1) ^ s[o],
        p = Ae(d, h, 1) ^ s[o + 1];
      for (let g = 0; g < 50; g += 10) (t[a + g] ^= l), (t[a + g + 1] ^= p);
    }
    let i = t[2],
      r = t[3];
    for (let a = 0; a < 24; a++) {
      const o = $e[a],
        c = Se(i, r, o),
        d = Ae(i, r, o),
        h = Ge[a];
      (i = t[h]), (r = t[h + 1]), (t[h] = c), (t[h + 1] = d);
    }
    for (let a = 0; a < 50; a += 10) {
      for (let o = 0; o < 10; o++) s[o] = t[a + o];
      for (let o = 0; o < 10; o++)
        t[a + o] ^= ~s[(o + 2) % 10] & s[(o + 4) % 10];
    }
    (t[0] ^= os[n]), (t[1] ^= cs[n]);
  }
  z(s);
}
class G extends ze {
  constructor(e, s, n, i = !1, r = 24) {
    if (
      (super(),
      (this.pos = 0),
      (this.posOut = 0),
      (this.finished = !1),
      (this.destroyed = !1),
      (this.enableXOF = !1),
      (this.blockLen = e),
      (this.suffix = s),
      (this.outputLen = n),
      (this.enableXOF = i),
      (this.rounds = r),
      Ee(n),
      !(0 < e && e < 200))
    )
      throw new Error("only keccak-f1600 function is supported");
    (this.state = new Uint8Array(200)), (this.state32 = Ut(this.state));
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    Ce(this.state32),
      Qe(this.state32, this.rounds),
      Ce(this.state32),
      (this.posOut = 0),
      (this.pos = 0);
  }
  update(e) {
    X(this), (e = ee(e)), j(e);
    const { blockLen: s, state: n } = this,
      i = e.length;
    for (let r = 0; r < i; ) {
      const a = Math.min(s - this.pos, i - r);
      for (let o = 0; o < a; o++) n[this.pos++] ^= e[r++];
      this.pos === s && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = !0;
    const { state: e, suffix: s, pos: n, blockLen: i } = this;
    (e[n] ^= s),
      (s & 128) !== 0 && n === i - 1 && this.keccak(),
      (e[i - 1] ^= 128),
      this.keccak();
  }
  writeInto(e) {
    X(this, !1), j(e), this.finish();
    const s = this.state,
      { blockLen: n } = this;
    for (let i = 0, r = e.length; i < r; ) {
      this.posOut >= n && this.keccak();
      const a = Math.min(n - this.posOut, r - i);
      e.set(s.subarray(this.posOut, this.posOut + a), i),
        (this.posOut += a),
        (i += a);
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return Ee(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if ((Fe(e, this), this.finished))
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    (this.destroyed = !0), z(this.state);
  }
  _cloneInto(e) {
    const {
      blockLen: s,
      suffix: n,
      outputLen: i,
      rounds: r,
      enableXOF: a,
    } = this;
    return (
      e || (e = new G(s, n, i, a, r)),
      e.state32.set(this.state32),
      (e.pos = this.pos),
      (e.posOut = this.posOut),
      (e.finished = this.finished),
      (e.rounds = r),
      (e.suffix = n),
      (e.outputLen = i),
      (e.enableXOF = a),
      (e.destroyed = this.destroyed),
      e
    );
  }
}
const R = (t, e, s) => Ze(() => new G(e, t, s)),
  ds = (() => R(6, 144, 224 / 8))(),
  ls = (() => R(6, 136, 256 / 8))(),
  hs = (() => R(6, 104, 384 / 8))(),
  us = (() => R(6, 72, 512 / 8))(),
  fs = (() => R(1, 144, 224 / 8))(),
  ps = (() => R(1, 136, 256 / 8))(),
  gs = (() => R(1, 104, 384 / 8))(),
  bs = (() => R(1, 72, 512 / 8))(),
  Xe = (t, e, s) =>
    Ft((n = {}) => new G(e, t, n.dkLen === void 0 ? s : n.dkLen, !0)),
  ms = (() => Xe(31, 168, 128 / 8))(),
  ws = (() => Xe(31, 136, 256 / 8))(),
  ys = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        keccakP: Qe,
        Keccak: G,
        sha3_224: ds,
        sha3_256: ls,
        sha3_384: hs,
        sha3_512: us,
        keccak_224: fs,
        keccak_256: ps,
        keccak_384: gs,
        keccak_512: bs,
        shake128: ms,
        shake256: ws,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  vs = Uint32Array.from([
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
    2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
    1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
    3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
    1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
    2428436474, 2756734187, 3204031479, 3329325298,
  ]),
  M = new Uint32Array(64);
class xs extends $t {
  constructor(e = 32) {
    super(64, e, 8, !1),
      (this.A = _[0] | 0),
      (this.B = _[1] | 0),
      (this.C = _[2] | 0),
      (this.D = _[3] | 0),
      (this.E = _[4] | 0),
      (this.F = _[5] | 0),
      (this.G = _[6] | 0),
      (this.H = _[7] | 0);
  }
  get() {
    const { A: e, B: s, C: n, D: i, E: r, F: a, G: o, H: c } = this;
    return [e, s, n, i, r, a, o, c];
  }
  set(e, s, n, i, r, a, o, c) {
    (this.A = e | 0),
      (this.B = s | 0),
      (this.C = n | 0),
      (this.D = i | 0),
      (this.E = r | 0),
      (this.F = a | 0),
      (this.G = o | 0),
      (this.H = c | 0);
  }
  process(e, s) {
    for (let l = 0; l < 16; l++, s += 4) M[l] = e.getUint32(s, !1);
    for (let l = 16; l < 64; l++) {
      const p = M[l - 15],
        g = M[l - 2],
        xe = k(p, 7) ^ k(p, 18) ^ (p >>> 3),
        ne = k(g, 17) ^ k(g, 19) ^ (g >>> 10);
      M[l] = (ne + M[l - 7] + xe + M[l - 16]) | 0;
    }
    let { A: n, B: i, C: r, D: a, E: o, F: c, G: d, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const p = k(o, 6) ^ k(o, 11) ^ k(o, 25),
        g = (h + p + Zt(o, c, d) + vs[l] + M[l]) | 0,
        ne = ((k(n, 2) ^ k(n, 13) ^ k(n, 22)) + Gt(n, i, r)) | 0;
      (h = d),
        (d = c),
        (c = o),
        (o = (a + g) | 0),
        (a = r),
        (r = i),
        (i = n),
        (n = (g + ne) | 0);
    }
    (n = (n + this.A) | 0),
      (i = (i + this.B) | 0),
      (r = (r + this.C) | 0),
      (a = (a + this.D) | 0),
      (o = (o + this.E) | 0),
      (c = (c + this.F) | 0),
      (d = (d + this.G) | 0),
      (h = (h + this.H) | 0),
      this.set(n, i, r, a, o, c, d, h);
  }
  roundClean() {
    z(M);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), z(this.buffer);
  }
}
const ks = Ze(() => new xs());
const Es = ks,
  Cs = (t, e) => {
    let s;
    switch (t) {
      case "standard":
        return (
          (s = e),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `
        );
      case "circle":
        return (
          (s = e),
          `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${e}' height='${s}' viewBox='0 0 999.81 999.81'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052fe;%7D.cls-2%7Bfill:%23fefefe;%7D.cls-3%7Bfill:%230152fe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M655-115.9h56c.83,1.59,2.36.88,3.56,1a478,478,0,0,1,75.06,10.42C891.4-81.76,978.33-32.58,1049.19,44q116.7,126,131.94,297.61c.38,4.14-.34,8.53,1.78,12.45v59c-1.58.84-.91,2.35-1,3.56a482.05,482.05,0,0,1-10.38,74.05c-24,106.72-76.64,196.76-158.83,268.93s-178.18,112.82-287.2,122.6c-4.83.43-9.86-.25-14.51,1.77H654c-1-1.68-2.69-.91-4.06-1a496.89,496.89,0,0,1-105.9-18.59c-93.54-27.42-172.78-77.59-236.91-150.94Q199.34,590.1,184.87,426.58c-.47-5.19.25-10.56-1.77-15.59V355c1.68-1,.91-2.7,1-4.06a498.12,498.12,0,0,1,18.58-105.9c26-88.75,72.64-164.9,140.6-227.57q126-116.27,297.21-131.61C645.32-114.57,650.35-113.88,655-115.9Zm377.92,500c0-192.44-156.31-349.49-347.56-350.15-194.13-.68-350.94,155.13-352.29,347.42-1.37,194.55,155.51,352.1,348.56,352.47C876.15,734.23,1032.93,577.84,1032.93,384.11Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-2' d='M1032.93,384.11c0,193.73-156.78,350.12-351.29,349.74-193-.37-349.93-157.92-348.56-352.47C334.43,189.09,491.24,33.28,685.37,34,876.62,34.62,1032.94,191.67,1032.93,384.11ZM683,496.81q43.74,0,87.48,0c15.55,0,25.32-9.72,25.33-25.21q0-87.48,0-175c0-15.83-9.68-25.46-25.59-25.46H595.77c-15.88,0-25.57,9.64-25.58,25.46q0,87.23,0,174.45c0,16.18,9.59,25.7,25.84,25.71Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-3' d='M683,496.81H596c-16.25,0-25.84-9.53-25.84-25.71q0-87.23,0-174.45c0-15.82,9.7-25.46,25.58-25.46H770.22c15.91,0,25.59,9.63,25.59,25.46q0,87.47,0,175c0,15.49-9.78,25.2-25.33,25.21Q726.74,496.84,683,496.81Z' transform='translate(-183.1 115.9)'/%3E%3C/svg%3E`
        );
      case "text":
        return (
          (s = (0.1 * e).toFixed(2)),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`
        );
      case "textWithLogo":
        return (
          (s = (0.25 * e).toFixed(2)),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`
        );
      case "textLight":
        return (
          (s = (0.1 * e).toFixed(2)),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`
        );
      case "textWithLogoLight":
        return (
          (s = (0.25 * e).toFixed(2)),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`
        );
      default:
        return (
          (s = e),
          `data:image/svg+xml,%3Csvg width='${e}' height='${s}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `
        );
    }
  };
class x {
  constructor(e, s) {
    (this.scope = e), (this.module = s);
  }
  storeObject(e, s) {
    this.setItem(e, JSON.stringify(s));
  }
  loadObject(e) {
    const s = this.getItem(e);
    return s ? JSON.parse(s) : void 0;
  }
  setItem(e, s) {
    localStorage.setItem(this.scopedKey(e), s);
  }
  getItem(e) {
    return localStorage.getItem(this.scopedKey(e));
  }
  removeItem(e) {
    localStorage.removeItem(this.scopedKey(e));
  }
  clear() {
    const e = this.scopedKey(""),
      s = [];
    for (let n = 0; n < localStorage.length; n++) {
      const i = localStorage.key(n);
      typeof i == "string" && i.startsWith(e) && s.push(i);
    }
    s.forEach((n) => localStorage.removeItem(n));
  }
  scopedKey(e) {
    return `-${this.scope}${this.module ? `:${this.module}` : ""}:${e}`;
  }
  static clearAll() {
    new x("CBWSDK").clear(), new x("walletlink").clear();
  }
}
const b = {
    rpc: {
      invalidInput: -32e3,
      resourceNotFound: -32001,
      resourceUnavailable: -32002,
      transactionRejected: -32003,
      methodNotSupported: -32004,
      limitExceeded: -32005,
      parse: -32700,
      invalidRequest: -32600,
      methodNotFound: -32601,
      invalidParams: -32602,
      internal: -32603,
    },
    provider: {
      userRejectedRequest: 4001,
      unauthorized: 4100,
      unsupportedMethod: 4200,
      disconnected: 4900,
      chainDisconnected: 4901,
      unsupportedChain: 4902,
    },
  },
  he = {
    "-32700": {
      standard: "JSON RPC 2.0",
      message:
        "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
    },
    "-32600": {
      standard: "JSON RPC 2.0",
      message: "The JSON sent is not a valid Request object.",
    },
    "-32601": {
      standard: "JSON RPC 2.0",
      message: "The method does not exist / is not available.",
    },
    "-32602": {
      standard: "JSON RPC 2.0",
      message: "Invalid method parameter(s).",
    },
    "-32603": { standard: "JSON RPC 2.0", message: "Internal JSON-RPC error." },
    "-32000": { standard: "EIP-1474", message: "Invalid input." },
    "-32001": { standard: "EIP-1474", message: "Resource not found." },
    "-32002": { standard: "EIP-1474", message: "Resource unavailable." },
    "-32003": { standard: "EIP-1474", message: "Transaction rejected." },
    "-32004": { standard: "EIP-1474", message: "Method not supported." },
    "-32005": { standard: "EIP-1474", message: "Request limit exceeded." },
    4001: { standard: "EIP-1193", message: "User rejected the request." },
    4100: {
      standard: "EIP-1193",
      message:
        "The requested account and/or method has not been authorized by the user.",
    },
    4200: {
      standard: "EIP-1193",
      message:
        "The requested method is not supported by this Ethereum provider.",
    },
    4900: {
      standard: "EIP-1193",
      message: "The provider is disconnected from all chains.",
    },
    4901: {
      standard: "EIP-1193",
      message: "The provider is disconnected from the specified chain.",
    },
    4902: { standard: "EIP-3085", message: "Unrecognized chain ID." },
  },
  et = "Unspecified error message.",
  Is = "Unspecified server error.";
function ge(t, e = et) {
  if (t && Number.isInteger(t)) {
    const s = t.toString();
    if (ue(he, s)) return he[s].message;
    if (tt(t)) return Is;
  }
  return e;
}
function Ss(t) {
  if (!Number.isInteger(t)) return !1;
  const e = t.toString();
  return !!(he[e] || tt(t));
}
function As(t, { shouldIncludeStack: e = !1 } = {}) {
  const s = {};
  if (
    t &&
    typeof t == "object" &&
    !Array.isArray(t) &&
    ue(t, "code") &&
    Ss(t.code)
  ) {
    const n = t;
    (s.code = n.code),
      n.message && typeof n.message == "string"
        ? ((s.message = n.message), ue(n, "data") && (s.data = n.data))
        : ((s.message = ge(s.code)), (s.data = { originalError: _e(t) }));
  } else
    (s.code = b.rpc.internal),
      (s.message = Me(t, "message") ? t.message : et),
      (s.data = { originalError: _e(t) });
  return e && (s.stack = Me(t, "stack") ? t.stack : void 0), s;
}
function tt(t) {
  return t >= -32099 && t <= -32e3;
}
function _e(t) {
  return t && typeof t == "object" && !Array.isArray(t)
    ? Object.assign({}, t)
    : t;
}
function ue(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
function Me(t, e) {
  return (
    typeof t == "object" && t !== null && e in t && typeof t[e] == "string"
  );
}
const u = {
  rpc: {
    parse: (t) => y(b.rpc.parse, t),
    invalidRequest: (t) => y(b.rpc.invalidRequest, t),
    invalidParams: (t) => y(b.rpc.invalidParams, t),
    methodNotFound: (t) => y(b.rpc.methodNotFound, t),
    internal: (t) => y(b.rpc.internal, t),
    server: (t) => {
      if (!t || typeof t != "object" || Array.isArray(t))
        throw new Error(
          "Ethereum RPC Server errors must provide single object argument."
        );
      const { code: e } = t;
      if (!Number.isInteger(e) || e > -32005 || e < -32099)
        throw new Error(
          '"code" must be an integer such that: -32099 <= code <= -32005'
        );
      return y(e, t);
    },
    invalidInput: (t) => y(b.rpc.invalidInput, t),
    resourceNotFound: (t) => y(b.rpc.resourceNotFound, t),
    resourceUnavailable: (t) => y(b.rpc.resourceUnavailable, t),
    transactionRejected: (t) => y(b.rpc.transactionRejected, t),
    methodNotSupported: (t) => y(b.rpc.methodNotSupported, t),
    limitExceeded: (t) => y(b.rpc.limitExceeded, t),
  },
  provider: {
    userRejectedRequest: (t) => N(b.provider.userRejectedRequest, t),
    unauthorized: (t) => N(b.provider.unauthorized, t),
    unsupportedMethod: (t) => N(b.provider.unsupportedMethod, t),
    disconnected: (t) => N(b.provider.disconnected, t),
    chainDisconnected: (t) => N(b.provider.chainDisconnected, t),
    unsupportedChain: (t) => N(b.provider.unsupportedChain, t),
    custom: (t) => {
      if (!t || typeof t != "object" || Array.isArray(t))
        throw new Error(
          "Ethereum Provider custom errors must provide single object argument."
        );
      const { code: e, message: s, data: n } = t;
      if (!s || typeof s != "string")
        throw new Error('"message" must be a nonempty string');
      return new it(e, s, n);
    },
  },
};
function y(t, e) {
  const [s, n] = st(e);
  return new nt(t, s || ge(t), n);
}
function N(t, e) {
  const [s, n] = st(e);
  return new it(t, s || ge(t), n);
}
function st(t) {
  if (t) {
    if (typeof t == "string") return [t];
    if (typeof t == "object" && !Array.isArray(t)) {
      const { message: e, data: s } = t;
      if (e && typeof e != "string")
        throw new Error("Must specify string message.");
      return [e || void 0, s];
    }
  }
  return [];
}
class nt extends Error {
  constructor(e, s, n) {
    if (!Number.isInteger(e)) throw new Error('"code" must be an integer.');
    if (!s || typeof s != "string")
      throw new Error('"message" must be a nonempty string.');
    super(s), (this.code = e), n !== void 0 && (this.data = n);
  }
}
class it extends nt {
  constructor(e, s, n) {
    if (!_s(e))
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999'
      );
    super(e, s, n);
  }
}
function _s(t) {
  return Number.isInteger(t) && t >= 1e3 && t <= 4999;
}
function be() {
  return (t) => t;
}
const Z = be(),
  Ms = be(),
  Ls = be();
function I(t) {
  return Math.floor(t);
}
const rt = /^[0-9]*$/,
  at = /^[a-f0-9]*$/;
function T(t) {
  return me(crypto.getRandomValues(new Uint8Array(t)));
}
function me(t) {
  return [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Q(t) {
  return new Uint8Array(t.match(/.{1,2}/g).map((e) => Number.parseInt(e, 16)));
}
function K(t, e = !1) {
  const s = t.toString("hex");
  return Z(e ? `0x${s}` : s);
}
function re(t) {
  return K(fe(t), !0);
}
function E(t) {
  return Ls(t.toString(10));
}
function P(t) {
  return Z(`0x${BigInt(t).toString(16)}`);
}
function ot(t) {
  return t.startsWith("0x") || t.startsWith("0X");
}
function we(t) {
  return ot(t) ? t.slice(2) : t;
}
function ct(t) {
  return ot(t) ? `0x${t.slice(2)}` : `0x${t}`;
}
function te(t) {
  if (typeof t != "string") return !1;
  const e = we(t).toLowerCase();
  return at.test(e);
}
function Ps(t, e = !1) {
  if (typeof t == "string") {
    const s = we(t).toLowerCase();
    if (at.test(s)) return Z(e ? `0x${s}` : s);
  }
  throw u.rpc.invalidParams(`"${String(t)}" is not a hexadecimal string`);
}
function ye(t, e = !1) {
  let s = Ps(t, !1);
  return s.length % 2 === 1 && (s = Z(`0${s}`)), e ? Z(`0x${s}`) : s;
}
function L(t) {
  if (typeof t == "string") {
    const e = we(t).toLowerCase();
    if (te(e) && e.length === 40) return Ms(ct(e));
  }
  throw u.rpc.invalidParams(`Invalid Ethereum address: ${String(t)}`);
}
function fe(t) {
  if (J.isBuffer(t)) return t;
  if (typeof t == "string") {
    if (te(t)) {
      const e = ye(t, !1);
      return J.from(e, "hex");
    }
    return J.from(t, "utf8");
  }
  throw u.rpc.invalidParams(`Not binary data: ${String(t)}`);
}
function V(t) {
  if (typeof t == "number" && Number.isInteger(t)) return I(t);
  if (typeof t == "string") {
    if (rt.test(t)) return I(Number(t));
    if (te(t)) return I(Number(BigInt(ye(t, !0))));
  }
  throw u.rpc.invalidParams(`Not an integer: ${String(t)}`);
}
function W(t) {
  if (t !== null && (typeof t == "bigint" || Ts(t)))
    return BigInt(t.toString(10));
  if (typeof t == "number") return BigInt(V(t));
  if (typeof t == "string") {
    if (rt.test(t)) return BigInt(t);
    if (te(t)) return BigInt(ye(t, !0));
  }
  throw u.rpc.invalidParams(`Not an integer: ${String(t)}`);
}
function Rs(t) {
  if (typeof t == "string") return JSON.parse(t);
  if (typeof t == "object") return t;
  throw u.rpc.invalidParams(`Not a JSON string or an object: ${String(t)}`);
}
function Ts(t) {
  if (t == null || typeof t.constructor != "function") return !1;
  const { constructor: e } = t;
  return typeof e.config == "function" && typeof e.EUCLID == "number";
}
function Ds() {
  const t =
      document.querySelector('link[sizes="192x192"]') ||
      document.querySelector('link[sizes="180x180"]') ||
      document.querySelector('link[rel="icon"]') ||
      document.querySelector('link[rel="shortcut icon"]'),
    { protocol: e, host: s } = document.location,
    n = t ? t.getAttribute("href") : null;
  return !n || n.startsWith("javascript:") || n.startsWith("vbscript:")
    ? `${e}//${s}/favicon.ico`
    : n.startsWith("http://") ||
      n.startsWith("https://") ||
      n.startsWith("data:")
    ? n
    : n.startsWith("//")
    ? e + n
    : `${e}//${s}${n}`;
}
async function Ns() {
  return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, !0, [
    "deriveKey",
  ]);
}
async function Os(t, e) {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: e },
    t,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function Us(t, e) {
  const s = crypto.getRandomValues(new Uint8Array(12)),
    n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: s },
      t,
      new TextEncoder().encode(e)
    );
  return { iv: s, cipherText: n };
}
async function js(t, { iv: e, cipherText: s }) {
  const n = await crypto.subtle.decrypt({ name: "AES-GCM", iv: e }, t, s);
  return new TextDecoder().decode(n);
}
function dt(t) {
  switch (t) {
    case "public":
      return "spki";
    case "private":
      return "pkcs8";
  }
}
async function lt(t, e) {
  const s = dt(t),
    n = await crypto.subtle.exportKey(s, e);
  return me(new Uint8Array(n));
}
async function ht(t, e) {
  const s = dt(t),
    n = Q(e).buffer;
  return await crypto.subtle.importKey(
    s,
    new Uint8Array(n),
    { name: "ECDH", namedCurve: "P-256" },
    !0,
    t === "private" ? ["deriveKey"] : []
  );
}
async function Hs(t, e) {
  const s = JSON.stringify(t, (n, i) => {
    if (!(i instanceof Error)) return i;
    const r = i;
    return Object.assign(Object.assign({}, r.code ? { code: r.code } : {}), {
      message: r.message,
    });
  });
  return Us(e, s);
}
async function Bs(t, e) {
  return JSON.parse(await js(e, t));
}
const ae = { storageKey: "ownPrivateKey", keyType: "private" },
  oe = { storageKey: "ownPublicKey", keyType: "public" },
  ce = { storageKey: "peerPublicKey", keyType: "public" };
class Ws {
  constructor() {
    (this.storage = new x("CBWSDK", "SCWKeyManager")),
      (this.ownPrivateKey = null),
      (this.ownPublicKey = null),
      (this.peerPublicKey = null),
      (this.sharedSecret = null);
  }
  async getOwnPublicKey() {
    return await this.loadKeysIfNeeded(), this.ownPublicKey;
  }
  async getSharedSecret() {
    return await this.loadKeysIfNeeded(), this.sharedSecret;
  }
  async setPeerPublicKey(e) {
    (this.sharedSecret = null),
      (this.peerPublicKey = e),
      await this.storeKey(ce, e),
      await this.loadKeysIfNeeded();
  }
  async clear() {
    (this.ownPrivateKey = null),
      (this.ownPublicKey = null),
      (this.peerPublicKey = null),
      (this.sharedSecret = null),
      this.storage.removeItem(oe.storageKey),
      this.storage.removeItem(ae.storageKey),
      this.storage.removeItem(ce.storageKey);
  }
  async generateKeyPair() {
    const e = await Ns();
    (this.ownPrivateKey = e.privateKey),
      (this.ownPublicKey = e.publicKey),
      await this.storeKey(ae, e.privateKey),
      await this.storeKey(oe, e.publicKey);
  }
  async loadKeysIfNeeded() {
    if (
      (this.ownPrivateKey === null &&
        (this.ownPrivateKey = await this.loadKey(ae)),
      this.ownPublicKey === null &&
        (this.ownPublicKey = await this.loadKey(oe)),
      (this.ownPrivateKey === null || this.ownPublicKey === null) &&
        (await this.generateKeyPair()),
      this.peerPublicKey === null &&
        (this.peerPublicKey = await this.loadKey(ce)),
      this.sharedSecret === null)
    ) {
      if (this.ownPrivateKey === null || this.peerPublicKey === null) return;
      this.sharedSecret = await Os(this.ownPrivateKey, this.peerPublicKey);
    }
  }
  async loadKey(e) {
    const s = this.storage.getItem(e.storageKey);
    return s ? ht(e.keyType, s) : null;
  }
  async storeKey(e, s) {
    const n = await lt(e.keyType, s);
    this.storage.setItem(e.storageKey, n);
  }
}
const H = "4.3.0",
  ut = "@coinbase/wallet-sdk";
async function ve(t, e) {
  const s = Object.assign(Object.assign({}, t), {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
    }),
    n = await window.fetch(e, {
      method: "POST",
      body: JSON.stringify(s),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Cbw-Sdk-Version": H,
        "X-Cbw-Sdk-Platform": ut,
      },
    }),
    { result: i, error: r } = await n.json();
  if (r) throw r;
  return i;
}
function qs() {
  return globalThis.coinbaseWalletExtension;
}
function Ks() {
  var t, e;
  try {
    const s = globalThis;
    return (t = s.ethereum) !== null && t !== void 0
      ? t
      : (e = s.top) === null || e === void 0
      ? void 0
      : e.ethereum;
  } catch {
    return;
  }
}
function ft({ metadata: t, preference: e }) {
  var s, n;
  const { appName: i, appLogoUrl: r, appChainIds: a } = t;
  if (e.options !== "smartWalletOnly") {
    const c = qs();
    if (c)
      return (
        (s = c.setAppInfo) === null || s === void 0 || s.call(c, i, r, a, e), c
      );
  }
  const o = Ks();
  if (o?.isCoinbaseBrowser)
    return (
      (n = o.setAppInfo) === null || n === void 0 || n.call(o, i, r, a, e), o
    );
}
function Vs(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw u.rpc.invalidParams({
      message: "Expected a single, non-array, object argument.",
      data: t,
    });
  const { method: e, params: s } = t;
  if (typeof e != "string" || e.length === 0)
    throw u.rpc.invalidParams({
      message: "'args.method' must be a non-empty string.",
      data: t,
    });
  if (s !== void 0 && !Array.isArray(s) && (typeof s != "object" || s === null))
    throw u.rpc.invalidParams({
      message: "'args.params' must be an object or array if provided.",
      data: t,
    });
  switch (e) {
    case "eth_sign":
    case "eth_signTypedData_v2":
    case "eth_subscribe":
    case "eth_unsubscribe":
      throw u.provider.unsupportedMethod();
  }
}
const Le = "accounts",
  Pe = "activeChain",
  Re = "availableChains",
  Te = "walletCapabilities";
class Fs {
  constructor(e) {
    var s, n, i;
    (this.metadata = e.metadata),
      (this.communicator = e.communicator),
      (this.callback = e.callback),
      (this.keyManager = new Ws()),
      (this.storage = new x("CBWSDK", "SCWStateManager")),
      (this.accounts =
        (s = this.storage.loadObject(Le)) !== null && s !== void 0 ? s : []),
      (this.chain = this.storage.loadObject(Pe) || {
        id:
          (i =
            (n = e.metadata.appChainIds) === null || n === void 0
              ? void 0
              : n[0]) !== null && i !== void 0
            ? i
            : 1,
      }),
      (this.handshake = this.handshake.bind(this)),
      (this.request = this.request.bind(this)),
      (this.createRequestMessage = this.createRequestMessage.bind(this)),
      (this.decryptResponseMessage = this.decryptResponseMessage.bind(this));
  }
  async handshake(e) {
    var s, n, i, r;
    await ((n = (s = this.communicator).waitForPopupLoaded) === null ||
    n === void 0
      ? void 0
      : n.call(s));
    const a = await this.createRequestMessage({
        handshake: {
          method: e.method,
          params: Object.assign(
            {},
            this.metadata,
            (i = e.params) !== null && i !== void 0 ? i : {}
          ),
        },
      }),
      o = await this.communicator.postRequestAndWaitForResponse(a);
    if ("failure" in o.content) throw o.content.failure;
    const c = await ht("public", o.sender);
    await this.keyManager.setPeerPublicKey(c);
    const h = (await this.decryptResponseMessage(o)).result;
    if ("error" in h) throw h.error;
    switch (e.method) {
      case "eth_requestAccounts": {
        const l = h.value;
        (this.accounts = l),
          this.storage.storeObject(Le, l),
          (r = this.callback) === null ||
            r === void 0 ||
            r.call(this, "accountsChanged", l);
        break;
      }
    }
  }
  async request(e) {
    var s;
    if (this.accounts.length === 0)
      switch (e.method) {
        case "wallet_sendCalls":
          return this.sendRequestToPopup(e);
        default:
          throw u.provider.unauthorized();
      }
    switch (e.method) {
      case "eth_requestAccounts":
        return (
          (s = this.callback) === null ||
            s === void 0 ||
            s.call(this, "connect", { chainId: P(this.chain.id) }),
          this.accounts
        );
      case "eth_accounts":
        return this.accounts;
      case "eth_coinbase":
        return this.accounts[0];
      case "net_version":
        return this.chain.id;
      case "eth_chainId":
        return P(this.chain.id);
      case "wallet_getCapabilities":
        return this.storage.loadObject(Te);
      case "wallet_switchEthereumChain":
        return this.handleSwitchChainRequest(e);
      case "eth_ecRecover":
      case "personal_sign":
      case "wallet_sign":
      case "personal_ecRecover":
      case "eth_signTransaction":
      case "eth_sendTransaction":
      case "eth_signTypedData_v1":
      case "eth_signTypedData_v3":
      case "eth_signTypedData_v4":
      case "eth_signTypedData":
      case "wallet_addEthereumChain":
      case "wallet_watchAsset":
      case "wallet_sendCalls":
      case "wallet_showCallsStatus":
      case "wallet_grantPermissions":
        return this.sendRequestToPopup(e);
      default:
        if (!this.chain.rpcUrl)
          throw u.rpc.internal("No RPC URL set for chain");
        return ve(e, this.chain.rpcUrl);
    }
  }
  async sendRequestToPopup(e) {
    var s, n;
    await ((n = (s = this.communicator).waitForPopupLoaded) === null ||
    n === void 0
      ? void 0
      : n.call(s));
    const i = await this.sendEncryptedRequest(e),
      a = (await this.decryptResponseMessage(i)).result;
    if ("error" in a) throw a.error;
    return a.value;
  }
  async cleanup() {
    var e, s;
    this.storage.clear(),
      await this.keyManager.clear(),
      (this.accounts = []),
      (this.chain = {
        id:
          (s =
            (e = this.metadata.appChainIds) === null || e === void 0
              ? void 0
              : e[0]) !== null && s !== void 0
            ? s
            : 1,
      });
  }
  async handleSwitchChainRequest(e) {
    var s;
    const n = e.params;
    if (!n || !(!((s = n[0]) === null || s === void 0) && s.chainId))
      throw u.rpc.invalidParams();
    const i = V(n[0].chainId);
    if (this.updateChain(i)) return null;
    const a = await this.sendRequestToPopup(e);
    return a === null && this.updateChain(i), a;
  }
  async sendEncryptedRequest(e) {
    const s = await this.keyManager.getSharedSecret();
    if (!s)
      throw u.provider.unauthorized(
        "No valid session found, try requestAccounts before other methods"
      );
    const n = await Hs({ action: e, chainId: this.chain.id }, s),
      i = await this.createRequestMessage({ encrypted: n });
    return this.communicator.postRequestAndWaitForResponse(i);
  }
  async createRequestMessage(e) {
    const s = await lt("public", await this.keyManager.getOwnPublicKey());
    return {
      id: crypto.randomUUID(),
      sender: s,
      content: e,
      timestamp: new Date(),
    };
  }
  async decryptResponseMessage(e) {
    var s, n;
    const i = e.content;
    if ("failure" in i) throw i.failure;
    const r = await this.keyManager.getSharedSecret();
    if (!r) throw u.provider.unauthorized("Invalid session");
    const a = await Bs(i.encrypted, r),
      o = (s = a.data) === null || s === void 0 ? void 0 : s.chains;
    if (o) {
      const d = Object.entries(o).map(([h, l]) => ({
        id: Number(h),
        rpcUrl: l,
      }));
      this.storage.storeObject(Re, d), this.updateChain(this.chain.id, d);
    }
    const c = (n = a.data) === null || n === void 0 ? void 0 : n.capabilities;
    return c && this.storage.storeObject(Te, c), a;
  }
  updateChain(e, s) {
    var n;
    const i = s ?? this.storage.loadObject(Re),
      r = i?.find((a) => a.id === e);
    return r
      ? (r !== this.chain &&
          ((this.chain = r),
          this.storage.storeObject(Pe, r),
          (n = this.callback) === null ||
            n === void 0 ||
            n.call(this, "chainChanged", P(r.id))),
        !0)
      : !1;
  }
}
const zs = Tt(ys),
  { keccak_256: Zs } = zs;
function pt(t) {
  return Buffer.allocUnsafe(t).fill(0);
}
function Gs(t) {
  return t.toString(2).length;
}
function gt(t, e) {
  let s = t.toString(16);
  s.length % 2 !== 0 && (s = "0" + s);
  const n = s.match(/.{1,2}/g).map((i) => parseInt(i, 16));
  for (; n.length < e; ) n.unshift(0);
  return Buffer.from(n);
}
function $s(t, e) {
  const s = t < 0n;
  let n;
  if (s) {
    const i = (1n << BigInt(e)) - 1n;
    n = (~t & i) + 1n;
  } else n = t;
  return (n &= (1n << BigInt(e)) - 1n), n;
}
function bt(t, e, s) {
  const n = pt(e);
  return (
    (t = se(t)),
    s
      ? t.length < e
        ? (t.copy(n), n)
        : t.slice(0, e)
      : t.length < e
      ? (t.copy(n, e - t.length), n)
      : t.slice(-e)
  );
}
function Ys(t, e) {
  return bt(t, e, !0);
}
function se(t) {
  if (!Buffer.isBuffer(t))
    if (Array.isArray(t)) t = Buffer.from(t);
    else if (typeof t == "string")
      mt(t) ? (t = Buffer.from(Xs(wt(t)), "hex")) : (t = Buffer.from(t));
    else if (typeof t == "number") t = intToBuffer(t);
    else if (t == null) t = Buffer.allocUnsafe(0);
    else if (typeof t == "bigint") t = gt(t);
    else if (t.toArray) t = Buffer.from(t.toArray());
    else throw new Error("invalid type");
  return t;
}
function Js(t) {
  return (t = se(t)), "0x" + t.toString("hex");
}
function Qs(t, e) {
  if (((t = se(t)), e || (e = 256), e !== 256)) throw new Error("unsupported");
  return Buffer.from(Zs(new Uint8Array(t)));
}
function Xs(t) {
  return t.length % 2 ? "0" + t : t;
}
function mt(t) {
  return typeof t == "string" && t.match(/^0x[0-9A-Fa-f]*$/);
}
function wt(t) {
  return typeof t == "string" && t.startsWith("0x") ? t.slice(2) : t;
}
var yt = {
  zeros: pt,
  setLength: bt,
  setLengthRight: Ys,
  isHexString: mt,
  stripHexPrefix: wt,
  toBuffer: se,
  bufferToHex: Js,
  keccak: Qs,
  bitLengthFromBigInt: Gs,
  bufferBEFromBigInt: gt,
  twosFromBigInt: $s,
};
const w = yt;
function vt(t) {
  return t.startsWith("int[")
    ? "int256" + t.slice(3)
    : t === "int"
    ? "int256"
    : t.startsWith("uint[")
    ? "uint256" + t.slice(4)
    : t === "uint"
    ? "uint256"
    : t.startsWith("fixed[")
    ? "fixed128x128" + t.slice(5)
    : t === "fixed"
    ? "fixed128x128"
    : t.startsWith("ufixed[")
    ? "ufixed128x128" + t.slice(6)
    : t === "ufixed"
    ? "ufixed128x128"
    : t;
}
function O(t) {
  return Number.parseInt(/^\D+(\d+)$/.exec(t)[1], 10);
}
function De(t) {
  var e = /^\D+(\d+)x(\d+)$/.exec(t);
  return [Number.parseInt(e[1], 10), Number.parseInt(e[2], 10)];
}
function xt(t) {
  var e = t.match(/(.*)\[(.*?)\]$/);
  return e ? (e[2] === "" ? "dynamic" : Number.parseInt(e[2], 10)) : null;
}
function D(t) {
  var e = typeof t;
  if (e === "string" || e === "number") return BigInt(t);
  if (e === "bigint") return t;
  throw new Error("Argument is not a number");
}
function C(t, e) {
  var s, n, i, r;
  if (t === "address") return C("uint160", D(e));
  if (t === "bool") return C("uint8", e ? 1 : 0);
  if (t === "string") return C("bytes", new Buffer(e, "utf8"));
  if (tn(t)) {
    if (typeof e.length > "u") throw new Error("Not an array?");
    if (((s = xt(t)), s !== "dynamic" && s !== 0 && e.length > s))
      throw new Error("Elements exceed array size: " + s);
    (i = []),
      (t = t.slice(0, t.lastIndexOf("["))),
      typeof e == "string" && (e = JSON.parse(e));
    for (r in e) i.push(C(t, e[r]));
    if (s === "dynamic") {
      var a = C("uint256", e.length);
      i.unshift(a);
    }
    return Buffer.concat(i);
  } else {
    if (t === "bytes")
      return (
        (e = new Buffer(e)),
        (i = Buffer.concat([C("uint256", e.length), e])),
        e.length % 32 !== 0 &&
          (i = Buffer.concat([i, w.zeros(32 - (e.length % 32))])),
        i
      );
    if (t.startsWith("bytes")) {
      if (((s = O(t)), s < 1 || s > 32))
        throw new Error("Invalid bytes<N> width: " + s);
      return w.setLengthRight(e, 32);
    } else if (t.startsWith("uint")) {
      if (((s = O(t)), s % 8 || s < 8 || s > 256))
        throw new Error("Invalid uint<N> width: " + s);
      n = D(e);
      const o = w.bitLengthFromBigInt(n);
      if (o > s)
        throw new Error("Supplied uint exceeds width: " + s + " vs " + o);
      if (n < 0) throw new Error("Supplied uint is negative");
      return w.bufferBEFromBigInt(n, 32);
    } else if (t.startsWith("int")) {
      if (((s = O(t)), s % 8 || s < 8 || s > 256))
        throw new Error("Invalid int<N> width: " + s);
      n = D(e);
      const o = w.bitLengthFromBigInt(n);
      if (o > s)
        throw new Error("Supplied int exceeds width: " + s + " vs " + o);
      const c = w.twosFromBigInt(n, 256);
      return w.bufferBEFromBigInt(c, 32);
    } else if (t.startsWith("ufixed")) {
      if (((s = De(t)), (n = D(e)), n < 0))
        throw new Error("Supplied ufixed is negative");
      return C("uint256", n * BigInt(2) ** BigInt(s[1]));
    } else if (t.startsWith("fixed"))
      return (s = De(t)), C("int256", D(e) * BigInt(2) ** BigInt(s[1]));
  }
  throw new Error("Unsupported or invalid type: " + t);
}
function en(t) {
  return t === "string" || t === "bytes" || xt(t) === "dynamic";
}
function tn(t) {
  return t.lastIndexOf("]") === t.length - 1;
}
function sn(t, e) {
  var s = [],
    n = [],
    i = 32 * t.length;
  for (var r in t) {
    var a = vt(t[r]),
      o = e[r],
      c = C(a, o);
    en(a) ? (s.push(C("uint256", i)), n.push(c), (i += c.length)) : s.push(c);
  }
  return Buffer.concat(s.concat(n));
}
function kt(t, e) {
  if (t.length !== e.length)
    throw new Error("Number of types are not matching the values");
  for (var s, n, i = [], r = 0; r < t.length; r++) {
    var a = vt(t[r]),
      o = e[r];
    if (a === "bytes") i.push(o);
    else if (a === "string") i.push(new Buffer(o, "utf8"));
    else if (a === "bool") i.push(new Buffer(o ? "01" : "00", "hex"));
    else if (a === "address") i.push(w.setLength(o, 20));
    else if (a.startsWith("bytes")) {
      if (((s = O(a)), s < 1 || s > 32))
        throw new Error("Invalid bytes<N> width: " + s);
      i.push(w.setLengthRight(o, s));
    } else if (a.startsWith("uint")) {
      if (((s = O(a)), s % 8 || s < 8 || s > 256))
        throw new Error("Invalid uint<N> width: " + s);
      n = D(o);
      const c = w.bitLengthFromBigInt(n);
      if (c > s)
        throw new Error("Supplied uint exceeds width: " + s + " vs " + c);
      i.push(w.bufferBEFromBigInt(n, s / 8));
    } else if (a.startsWith("int")) {
      if (((s = O(a)), s % 8 || s < 8 || s > 256))
        throw new Error("Invalid int<N> width: " + s);
      n = D(o);
      const c = w.bitLengthFromBigInt(n);
      if (c > s)
        throw new Error("Supplied int exceeds width: " + s + " vs " + c);
      const d = w.twosFromBigInt(n, s);
      i.push(w.bufferBEFromBigInt(d, s / 8));
    } else throw new Error("Unsupported or invalid type: " + a);
  }
  return Buffer.concat(i);
}
function nn(t, e) {
  return w.keccak(kt(t, e));
}
var rn = { rawEncode: sn, solidityPack: kt, soliditySHA3: nn };
const v = yt,
  F = rn,
  Et = {
    type: "object",
    properties: {
      types: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, type: { type: "string" } },
            required: ["name", "type"],
          },
        },
      },
      primaryType: { type: "string" },
      domain: { type: "object" },
      message: { type: "object" },
    },
    required: ["types", "primaryType", "domain", "message"],
  },
  de = {
    encodeData(t, e, s, n = !0) {
      const i = ["bytes32"],
        r = [this.hashType(t, s)];
      if (n) {
        const a = (o, c, d) => {
          if (s[c] !== void 0)
            return [
              "bytes32",
              d == null
                ? "0x0000000000000000000000000000000000000000000000000000000000000000"
                : v.keccak(this.encodeData(c, d, s, n)),
            ];
          if (d === void 0)
            throw new Error(`missing value for field ${o} of type ${c}`);
          if (c === "bytes") return ["bytes32", v.keccak(d)];
          if (c === "string")
            return (
              typeof d == "string" && (d = Buffer.from(d, "utf8")),
              ["bytes32", v.keccak(d)]
            );
          if (c.lastIndexOf("]") === c.length - 1) {
            const h = c.slice(0, c.lastIndexOf("[")),
              l = d.map((p) => a(o, h, p));
            return [
              "bytes32",
              v.keccak(
                F.rawEncode(
                  l.map(([p]) => p),
                  l.map(([, p]) => p)
                )
              ),
            ];
          }
          return [c, d];
        };
        for (const o of s[t]) {
          const [c, d] = a(o.name, o.type, e[o.name]);
          i.push(c), r.push(d);
        }
      } else
        for (const a of s[t]) {
          let o = e[a.name];
          if (o !== void 0)
            if (a.type === "bytes")
              i.push("bytes32"), (o = v.keccak(o)), r.push(o);
            else if (a.type === "string")
              i.push("bytes32"),
                typeof o == "string" && (o = Buffer.from(o, "utf8")),
                (o = v.keccak(o)),
                r.push(o);
            else if (s[a.type] !== void 0)
              i.push("bytes32"),
                (o = v.keccak(this.encodeData(a.type, o, s, n))),
                r.push(o);
            else {
              if (a.type.lastIndexOf("]") === a.type.length - 1)
                throw new Error("Arrays currently unimplemented in encodeData");
              i.push(a.type), r.push(o);
            }
        }
      return F.rawEncode(i, r);
    },
    encodeType(t, e) {
      let s = "",
        n = this.findTypeDependencies(t, e).filter((i) => i !== t);
      n = [t].concat(n.sort());
      for (const i of n) {
        if (!e[i]) throw new Error("No type definition specified: " + i);
        s +=
          i +
          "(" +
          e[i].map(({ name: a, type: o }) => o + " " + a).join(",") +
          ")";
      }
      return s;
    },
    findTypeDependencies(t, e, s = []) {
      if (((t = t.match(/^\w*/)[0]), s.includes(t) || e[t] === void 0))
        return s;
      s.push(t);
      for (const n of e[t])
        for (const i of this.findTypeDependencies(n.type, e, s))
          !s.includes(i) && s.push(i);
      return s;
    },
    hashStruct(t, e, s, n = !0) {
      return v.keccak(this.encodeData(t, e, s, n));
    },
    hashType(t, e) {
      return v.keccak(this.encodeType(t, e));
    },
    sanitizeData(t) {
      const e = {};
      for (const s in Et.properties) t[s] && (e[s] = t[s]);
      return (
        e.types && (e.types = Object.assign({ EIP712Domain: [] }, e.types)), e
      );
    },
    hash(t, e = !0) {
      const s = this.sanitizeData(t),
        n = [Buffer.from("1901", "hex")];
      return (
        n.push(this.hashStruct("EIP712Domain", s.domain, s.types, e)),
        s.primaryType !== "EIP712Domain" &&
          n.push(this.hashStruct(s.primaryType, s.message, s.types, e)),
        v.keccak(Buffer.concat(n))
      );
    },
  };
var an = {
  TYPED_MESSAGE_SCHEMA: Et,
  TypedDataUtils: de,
  hashForSignTypedDataLegacy: function (t) {
    return on(t.data);
  },
  hashForSignTypedData_v3: function (t) {
    return de.hash(t.data, !1);
  },
  hashForSignTypedData_v4: function (t) {
    return de.hash(t.data);
  },
};
function on(t) {
  const e = new Error("Expect argument to be non-empty array");
  if (typeof t != "object" || !t.length) throw e;
  const s = t.map(function (r) {
      return r.type === "bytes" ? v.toBuffer(r.value) : r.value;
    }),
    n = t.map(function (r) {
      return r.type;
    }),
    i = t.map(function (r) {
      if (!r.name) throw e;
      return r.type + " " + r.name;
    });
  return F.soliditySHA3(
    ["bytes32", "bytes32"],
    [
      F.soliditySHA3(new Array(t.length).fill("string"), i),
      F.soliditySHA3(n, s),
    ]
  );
}
const Y = an,
  cn = "walletUsername",
  pe = "Addresses",
  dn = "AppVersion";
function m(t) {
  return t.errorMessage !== void 0;
}
class ln {
  constructor(e) {
    this.secret = e;
  }
  async encrypt(e) {
    const s = this.secret;
    if (s.length !== 64) throw Error("secret must be 256 bits");
    const n = crypto.getRandomValues(new Uint8Array(12)),
      i = await crypto.subtle.importKey("raw", Q(s), { name: "aes-gcm" }, !1, [
        "encrypt",
        "decrypt",
      ]),
      r = new TextEncoder(),
      a = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: n },
        i,
        r.encode(e)
      ),
      o = 16,
      c = a.slice(a.byteLength - o),
      d = a.slice(0, a.byteLength - o),
      h = new Uint8Array(c),
      l = new Uint8Array(d),
      p = new Uint8Array([...n, ...h, ...l]);
    return me(p);
  }
  async decrypt(e) {
    const s = this.secret;
    if (s.length !== 64) throw Error("secret must be 256 bits");
    return new Promise((n, i) => {
      (async function () {
        const r = await crypto.subtle.importKey(
            "raw",
            Q(s),
            { name: "aes-gcm" },
            !1,
            ["encrypt", "decrypt"]
          ),
          a = Q(e),
          o = a.slice(0, 12),
          c = a.slice(12, 28),
          d = a.slice(28),
          h = new Uint8Array([...d, ...c]),
          l = { name: "AES-GCM", iv: new Uint8Array(o) };
        try {
          const p = await window.crypto.subtle.decrypt(l, r, h),
            g = new TextDecoder();
          n(g.decode(p));
        } catch (p) {
          i(p);
        }
      })();
    });
  }
}
class hn {
  constructor(e, s, n) {
    (this.linkAPIUrl = e), (this.sessionId = s);
    const i = `${s}:${n}`;
    this.auth = `Basic ${btoa(i)}`;
  }
  async markUnseenEventsAsSeen(e) {
    return Promise.all(
      e.map((s) =>
        fetch(`${this.linkAPIUrl}/events/${s.eventId}/seen`, {
          method: "POST",
          headers: { Authorization: this.auth },
        })
      )
    ).catch((s) => console.error("Unabled to mark event as failed:", s));
  }
  async fetchUnseenEvents() {
    var e;
    const s = await fetch(`${this.linkAPIUrl}/events?unseen=true`, {
      headers: { Authorization: this.auth },
    });
    if (s.ok) {
      const { events: n, error: i } = await s.json();
      if (i) throw new Error(`Check unseen events failed: ${i}`);
      const r =
        (e = n
          ?.filter((a) => a.event === "Web3Response")
          .map((a) => ({
            type: "Event",
            sessionId: this.sessionId,
            eventId: a.id,
            event: a.event,
            data: a.data,
          }))) !== null && e !== void 0
          ? e
          : [];
      return this.markUnseenEventsAsSeen(r), r;
    }
    throw new Error(`Check unseen events failed: ${s.status}`);
  }
}
var A;
(function (t) {
  (t[(t.DISCONNECTED = 0)] = "DISCONNECTED"),
    (t[(t.CONNECTING = 1)] = "CONNECTING"),
    (t[(t.CONNECTED = 2)] = "CONNECTED");
})(A || (A = {}));
class un {
  setConnectionStateListener(e) {
    this.connectionStateListener = e;
  }
  setIncomingDataListener(e) {
    this.incomingDataListener = e;
  }
  constructor(e, s = WebSocket) {
    (this.WebSocketClass = s),
      (this.webSocket = null),
      (this.pendingData = []),
      (this.url = e.replace(/^http/, "ws"));
  }
  async connect() {
    if (this.webSocket) throw new Error("webSocket object is not null");
    return new Promise((e, s) => {
      var n;
      let i;
      try {
        this.webSocket = i = new this.WebSocketClass(this.url);
      } catch (r) {
        s(r);
        return;
      }
      (n = this.connectionStateListener) === null ||
        n === void 0 ||
        n.call(this, A.CONNECTING),
        (i.onclose = (r) => {
          var a;
          this.clearWebSocket(),
            s(new Error(`websocket error ${r.code}: ${r.reason}`)),
            (a = this.connectionStateListener) === null ||
              a === void 0 ||
              a.call(this, A.DISCONNECTED);
        }),
        (i.onopen = (r) => {
          var a;
          e(),
            (a = this.connectionStateListener) === null ||
              a === void 0 ||
              a.call(this, A.CONNECTED),
            this.pendingData.length > 0 &&
              ([...this.pendingData].forEach((c) => this.sendData(c)),
              (this.pendingData = []));
        }),
        (i.onmessage = (r) => {
          var a, o;
          if (r.data === "h")
            (a = this.incomingDataListener) === null ||
              a === void 0 ||
              a.call(this, { type: "Heartbeat" });
          else
            try {
              const c = JSON.parse(r.data);
              (o = this.incomingDataListener) === null ||
                o === void 0 ||
                o.call(this, c);
            } catch {}
        });
    });
  }
  disconnect() {
    var e;
    const { webSocket: s } = this;
    if (!!s) {
      this.clearWebSocket(),
        (e = this.connectionStateListener) === null ||
          e === void 0 ||
          e.call(this, A.DISCONNECTED),
        (this.connectionStateListener = void 0),
        (this.incomingDataListener = void 0);
      try {
        s.close();
      } catch {}
    }
  }
  sendData(e) {
    const { webSocket: s } = this;
    if (!s) {
      this.pendingData.push(e), this.connect();
      return;
    }
    s.send(e);
  }
  clearWebSocket() {
    const { webSocket: e } = this;
    !e ||
      ((this.webSocket = null),
      (e.onclose = null),
      (e.onerror = null),
      (e.onmessage = null),
      (e.onopen = null));
  }
}
const Ne = 1e4,
  fn = 6e4;
class pn {
  constructor({ session: e, linkAPIUrl: s, listener: n }) {
    (this.destroyed = !1),
      (this.lastHeartbeatResponse = 0),
      (this.nextReqId = I(1)),
      (this._connected = !1),
      (this._linked = !1),
      (this.shouldFetchUnseenEventsOnConnect = !1),
      (this.requestResolutions = new Map()),
      (this.handleSessionMetadataUpdated = (r) => {
        if (!r) return;
        new Map([
          ["__destroyed", this.handleDestroyed],
          ["EthereumAddress", this.handleAccountUpdated],
          ["WalletUsername", this.handleWalletUsernameUpdated],
          ["AppVersion", this.handleAppVersionUpdated],
          [
            "ChainId",
            (o) => r.JsonRpcUrl && this.handleChainUpdated(o, r.JsonRpcUrl),
          ],
        ]).forEach((o, c) => {
          const d = r[c];
          d !== void 0 && o(d);
        });
      }),
      (this.handleDestroyed = (r) => {
        var a;
        r === "1" &&
          ((a = this.listener) === null || a === void 0 || a.resetAndReload());
      }),
      (this.handleAccountUpdated = async (r) => {
        var a;
        const o = await this.cipher.decrypt(r);
        (a = this.listener) === null || a === void 0 || a.accountUpdated(o);
      }),
      (this.handleMetadataUpdated = async (r, a) => {
        var o;
        const c = await this.cipher.decrypt(a);
        (o = this.listener) === null || o === void 0 || o.metadataUpdated(r, c);
      }),
      (this.handleWalletUsernameUpdated = async (r) => {
        this.handleMetadataUpdated(cn, r);
      }),
      (this.handleAppVersionUpdated = async (r) => {
        this.handleMetadataUpdated(dn, r);
      }),
      (this.handleChainUpdated = async (r, a) => {
        var o;
        const c = await this.cipher.decrypt(r),
          d = await this.cipher.decrypt(a);
        (o = this.listener) === null || o === void 0 || o.chainUpdated(c, d);
      }),
      (this.session = e),
      (this.cipher = new ln(e.secret)),
      (this.listener = n);
    const i = new un(`${s}/rpc`, WebSocket);
    i.setConnectionStateListener(async (r) => {
      let a = !1;
      switch (r) {
        case A.DISCONNECTED:
          if (!this.destroyed) {
            const o = async () => {
              await new Promise((c) => setTimeout(c, 5e3)),
                this.destroyed ||
                  i.connect().catch(() => {
                    o();
                  });
            };
            o();
          }
          break;
        case A.CONNECTED:
          (a = await this.handleConnected()),
            this.updateLastHeartbeat(),
            setInterval(() => {
              this.heartbeat();
            }, Ne),
            this.shouldFetchUnseenEventsOnConnect &&
              this.fetchUnseenEventsAPI();
          break;
        case A.CONNECTING:
          break;
      }
      this.connected !== a && (this.connected = a);
    }),
      i.setIncomingDataListener((r) => {
        var a;
        switch (r.type) {
          case "Heartbeat":
            this.updateLastHeartbeat();
            return;
          case "IsLinkedOK":
          case "Linked": {
            const o = r.type === "IsLinkedOK" ? r.linked : void 0;
            this.linked = o || r.onlineGuests > 0;
            break;
          }
          case "GetSessionConfigOK":
          case "SessionConfigUpdated": {
            this.handleSessionMetadataUpdated(r.metadata);
            break;
          }
          case "Event": {
            this.handleIncomingEvent(r);
            break;
          }
        }
        r.id !== void 0 &&
          ((a = this.requestResolutions.get(r.id)) === null ||
            a === void 0 ||
            a(r));
      }),
      (this.ws = i),
      (this.http = new hn(s, e.id, e.key));
  }
  connect() {
    if (this.destroyed) throw new Error("instance is destroyed");
    this.ws.connect();
  }
  async destroy() {
    this.destroyed ||
      (await this.makeRequest(
        {
          type: "SetSessionConfig",
          id: I(this.nextReqId++),
          sessionId: this.session.id,
          metadata: { __destroyed: "1" },
        },
        { timeout: 1e3 }
      ),
      (this.destroyed = !0),
      this.ws.disconnect(),
      (this.listener = void 0));
  }
  get connected() {
    return this._connected;
  }
  set connected(e) {
    this._connected = e;
  }
  get linked() {
    return this._linked;
  }
  set linked(e) {
    var s, n;
    (this._linked = e),
      e && ((s = this.onceLinked) === null || s === void 0 || s.call(this)),
      (n = this.listener) === null || n === void 0 || n.linkedUpdated(e);
  }
  setOnceLinked(e) {
    return new Promise((s) => {
      this.linked
        ? e().then(s)
        : (this.onceLinked = () => {
            e().then(s), (this.onceLinked = void 0);
          });
    });
  }
  async handleIncomingEvent(e) {
    var s;
    if (e.type !== "Event" || e.event !== "Web3Response") return;
    const n = await this.cipher.decrypt(e.data),
      i = JSON.parse(n);
    if (i.type !== "WEB3_RESPONSE") return;
    const { id: r, response: a } = i;
    (s = this.listener) === null ||
      s === void 0 ||
      s.handleWeb3ResponseMessage(r, a);
  }
  async checkUnseenEvents() {
    if (!this.connected) {
      this.shouldFetchUnseenEventsOnConnect = !0;
      return;
    }
    await new Promise((e) => setTimeout(e, 250));
    try {
      await this.fetchUnseenEventsAPI();
    } catch (e) {
      console.error("Unable to check for unseen events", e);
    }
  }
  async fetchUnseenEventsAPI() {
    (this.shouldFetchUnseenEventsOnConnect = !1),
      (await this.http.fetchUnseenEvents()).forEach((s) =>
        this.handleIncomingEvent(s)
      );
  }
  async publishEvent(e, s, n = !1) {
    const i = await this.cipher.encrypt(
        JSON.stringify(
          Object.assign(Object.assign({}, s), {
            origin: location.origin,
            location: location.href,
            relaySource:
              "coinbaseWalletExtension" in window &&
              window.coinbaseWalletExtension
                ? "injected_sdk"
                : "sdk",
          })
        )
      ),
      r = {
        type: "PublishEvent",
        id: I(this.nextReqId++),
        sessionId: this.session.id,
        event: e,
        data: i,
        callWebhook: n,
      };
    return this.setOnceLinked(async () => {
      const a = await this.makeRequest(r);
      if (a.type === "Fail")
        throw new Error(a.error || "failed to publish event");
      return a.eventId;
    });
  }
  sendData(e) {
    this.ws.sendData(JSON.stringify(e));
  }
  updateLastHeartbeat() {
    this.lastHeartbeatResponse = Date.now();
  }
  heartbeat() {
    if (Date.now() - this.lastHeartbeatResponse > Ne * 2) {
      this.ws.disconnect();
      return;
    }
    try {
      this.ws.sendData("h");
    } catch {}
  }
  async makeRequest(e, s = { timeout: fn }) {
    const n = e.id;
    this.sendData(e);
    let i;
    return Promise.race([
      new Promise((r, a) => {
        i = window.setTimeout(() => {
          a(new Error(`request ${n} timed out`));
        }, s.timeout);
      }),
      new Promise((r) => {
        this.requestResolutions.set(n, (a) => {
          clearTimeout(i), r(a), this.requestResolutions.delete(n);
        });
      }),
    ]);
  }
  async handleConnected() {
    return (
      await this.makeRequest({
        type: "HostSession",
        id: I(this.nextReqId++),
        sessionId: this.session.id,
        sessionKey: this.session.key,
      })
    ).type === "Fail"
      ? !1
      : (this.sendData({
          type: "IsLinked",
          id: I(this.nextReqId++),
          sessionId: this.session.id,
        }),
        this.sendData({
          type: "GetSessionConfig",
          id: I(this.nextReqId++),
          sessionId: this.session.id,
        }),
        !0);
  }
}
class gn {
  constructor() {
    (this._nextRequestId = 0), (this.callbacks = new Map());
  }
  makeRequestId() {
    this._nextRequestId = (this._nextRequestId + 1) % 2147483647;
    const e = this._nextRequestId,
      s = ct(e.toString(16));
    return this.callbacks.get(s) && this.callbacks.delete(s), e;
  }
}
const Oe = "session:id",
  Ue = "session:secret",
  je = "session:linked";
class U {
  constructor(e, s, n, i = !1) {
    (this.storage = e),
      (this.id = s),
      (this.secret = n),
      (this.key = Kt(Es(`${s}, ${n} WalletLink`))),
      (this._linked = !!i);
  }
  static create(e) {
    const s = T(16),
      n = T(32);
    return new U(e, s, n).save();
  }
  static load(e) {
    const s = e.getItem(Oe),
      n = e.getItem(je),
      i = e.getItem(Ue);
    return s && i ? new U(e, s, i, n === "1") : null;
  }
  get linked() {
    return this._linked;
  }
  set linked(e) {
    (this._linked = e), this.persistLinked();
  }
  save() {
    return (
      this.storage.setItem(Oe, this.id),
      this.storage.setItem(Ue, this.secret),
      this.persistLinked(),
      this
    );
  }
  persistLinked() {
    this.storage.setItem(je, this._linked ? "1" : "0");
  }
}
function bn() {
  try {
    return window.frameElement !== null;
  } catch {
    return !1;
  }
}
function mn() {
  try {
    return bn() && window.top ? window.top.location : window.location;
  } catch {
    return window.location;
  }
}
function wn() {
  var t;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    (t = window?.navigator) === null || t === void 0 ? void 0 : t.userAgent
  );
}
function Ct() {
  var t, e;
  return (e =
    (t = window?.matchMedia) === null || t === void 0
      ? void 0
      : t.call(window, "(prefers-color-scheme: dark)").matches) !== null &&
    e !== void 0
    ? e
    : !1;
}
const yn = (() =>
  '@namespace svg "http://www.w3.org/2000/svg";.-cbwsdk-css-reset,.-cbwsdk-css-reset *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:rgba(0,0,0,0);background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;box-shadow:none;box-sizing:border-box;caption-side:top;clear:none;clip:auto;color:inherit;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;counter-increment:none;counter-reset:none;direction:ltr;empty-cells:show;float:none;font:normal;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;height:auto;hyphens:none;letter-spacing:normal;line-height:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;margin:0;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;padding:0;padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;pointer-events:auto;position:static;quotes:"\\201C" "\\201D" "\\2018" "\\2019";tab-size:8;table-layout:auto;text-align:inherit;text-align-last:auto;text-decoration:none;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;word-spacing:normal;z-index:auto}.-cbwsdk-css-reset strong{font-weight:bold}.-cbwsdk-css-reset *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;line-height:1}.-cbwsdk-css-reset [class*=container]{margin:0;padding:0}.-cbwsdk-css-reset style{display:none}')();
function It() {
  const t = document.createElement("style");
  (t.type = "text/css"),
    t.appendChild(document.createTextNode(yn)),
    document.documentElement.appendChild(t);
}
const vn = (() =>
    ".-cbwsdk-css-reset .-gear-container{margin-left:16px !important;margin-right:9px !important;display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:opacity .25s}.-cbwsdk-css-reset .-gear-container *{user-select:none}.-cbwsdk-css-reset .-gear-container svg{opacity:0;position:absolute}.-cbwsdk-css-reset .-gear-icon{height:12px;width:12px;z-index:10000}.-cbwsdk-css-reset .-cbwsdk-snackbar{align-items:flex-end;display:flex;flex-direction:column;position:fixed;right:0;top:0;z-index:2147483647}.-cbwsdk-css-reset .-cbwsdk-snackbar *{user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance{display:flex;flex-direction:column;margin:8px 16px 0 16px;overflow:visible;text-align:left;transform:translateX(0);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header:hover .-gear-container svg{opacity:1}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header{display:flex;align-items:center;background:#fff;overflow:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-cblogo{margin:8px 8px 8px 8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-message{color:#000;font-size:13px;line-height:1.5;user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu{background:#fff;transition:opacity .25s ease-in-out,transform .25s linear,visibility 0s;visibility:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;opacity:0;flex-direction:column;padding-left:8px;padding-right:8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:last-child{margin-bottom:8px !important}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover{background:#f5f7f8;border-radius:6px;transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover span{color:#050f19;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover svg path{fill:#000;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item{visibility:inherit;height:35px;margin-top:8px;margin-bottom:0;display:flex;flex-direction:row;align-items:center;padding:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item *{visibility:inherit;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover{background:rgba(223,95,103,.2);transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover svg path{fill:#df5f67;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover span{color:#df5f67;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-info{color:#aaa;font-size:13px;margin:0 8px 0 32px;position:absolute}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-hidden{opacity:0;text-align:left;transform:translateX(25%);transition:opacity .5s linear}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-expanded .-cbwsdk-snackbar-instance-menu{opacity:1;display:flex;transform:translateY(8px);visibility:visible}")(),
  xn =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuNDkyIDEwLjQxOWE4LjkzIDguOTMgMCAwMTguOTMtOC45M2gxMS4xNjNhOC45MyA4LjkzIDAgMDE4LjkzIDguOTN2MTEuMTYzYTguOTMgOC45MyAwIDAxLTguOTMgOC45M0gxMC40MjJhOC45MyA4LjkzIDAgMDEtOC45My04LjkzVjEwLjQxOXoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjQxOSAwSDIxLjU4QzI3LjMzNSAwIDMyIDQuNjY1IDMyIDEwLjQxOVYyMS41OEMzMiAyNy4zMzUgMjcuMzM1IDMyIDIxLjU4MSAzMkgxMC40MkM0LjY2NSAzMiAwIDI3LjMzNSAwIDIxLjU4MVYxMC40MkMwIDQuNjY1IDQuNjY1IDAgMTAuNDE5IDB6bTAgMS40ODhhOC45MyA4LjkzIDAgMDAtOC45MyA4LjkzdjExLjE2M2E4LjkzIDguOTMgMCAwMDguOTMgOC45M0gyMS41OGE4LjkzIDguOTMgMCAwMDguOTMtOC45M1YxMC40MmE4LjkzIDguOTMgMCAwMC04LjkzLTguOTNIMTAuNDJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45OTggMjYuMDQ5Yy01LjU0OSAwLTEwLjA0Ny00LjQ5OC0xMC4wNDctMTAuMDQ3IDAtNS41NDggNC40OTgtMTAuMDQ2IDEwLjA0Ny0xMC4wNDYgNS41NDggMCAxMC4wNDYgNC40OTggMTAuMDQ2IDEwLjA0NiAwIDUuNTQ5LTQuNDk4IDEwLjA0Ny0xMC4wNDYgMTAuMDQ3eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMi43NjIgMTQuMjU0YzAtLjgyMi42NjctMS40ODkgMS40ODktMS40ODloMy40OTdjLjgyMiAwIDEuNDg4LjY2NiAxLjQ4OCAxLjQ4OXYzLjQ5N2MwIC44MjItLjY2NiAxLjQ4OC0xLjQ4OCAxLjQ4OGgtMy40OTdhMS40ODggMS40ODggMCAwMS0xLjQ4OS0xLjQ4OHYtMy40OTh6IiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+",
  kn =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDYuNzV2LTEuNWwtMS43Mi0uNTdjLS4wOC0uMjctLjE5LS41Mi0uMzItLjc3bC44MS0xLjYyLTEuMDYtMS4wNi0xLjYyLjgxYy0uMjQtLjEzLS41LS4yNC0uNzctLjMyTDYuNzUgMGgtMS41bC0uNTcgMS43MmMtLjI3LjA4LS41My4xOS0uNzcuMzJsLTEuNjItLjgxLTEuMDYgMS4wNi44MSAxLjYyYy0uMTMuMjQtLjI0LjUtLjMyLjc3TDAgNS4yNXYxLjVsMS43Mi41N2MuMDguMjcuMTkuNTMuMzIuNzdsLS44MSAxLjYyIDEuMDYgMS4wNiAxLjYyLS44MWMuMjQuMTMuNS4yMy43Ny4zMkw1LjI1IDEyaDEuNWwuNTctMS43MmMuMjctLjA4LjUyLS4xOS43Ny0uMzJsMS42Mi44MSAxLjA2LTEuMDYtLjgxLTEuNjJjLjEzLS4yNC4yMy0uNS4zMi0uNzdMMTIgNi43NXpNNiA4LjVhMi41IDIuNSAwIDAxMC01IDIuNSAyLjUgMCAwMTAgNXoiIGZpbGw9IiMwNTBGMTkiLz48L3N2Zz4=";
class En {
  constructor() {
    (this.items = new Map()),
      (this.nextItemKey = 0),
      (this.root = null),
      (this.darkMode = Ct());
  }
  attach(e) {
    (this.root = document.createElement("div")),
      (this.root.className = "-cbwsdk-snackbar-root"),
      e.appendChild(this.root),
      this.render();
  }
  presentItem(e) {
    const s = this.nextItemKey++;
    return (
      this.items.set(s, e),
      this.render(),
      () => {
        this.items.delete(s), this.render();
      }
    );
  }
  clear() {
    this.items.clear(), this.render();
  }
  render() {
    !this.root ||
      le(
        f(
          "div",
          null,
          f(
            St,
            { darkMode: this.darkMode },
            Array.from(this.items.entries()).map(([e, s]) =>
              f(Cn, Object.assign({}, s, { key: e }))
            )
          )
        ),
        this.root
      );
  }
}
const St = (t) =>
    f(
      "div",
      { class: q("-cbwsdk-snackbar-container") },
      f("style", null, vn),
      f("div", { class: "-cbwsdk-snackbar" }, t.children)
    ),
  Cn = ({ autoExpand: t, message: e, menuItems: s }) => {
    const [n, i] = ke(!0),
      [r, a] = ke(t ?? !1);
    Nt(() => {
      const c = [
        window.setTimeout(() => {
          i(!1);
        }, 1),
        window.setTimeout(() => {
          a(!0);
        }, 1e4),
      ];
      return () => {
        c.forEach(window.clearTimeout);
      };
    });
    const o = () => {
      a(!r);
    };
    return f(
      "div",
      {
        class: q(
          "-cbwsdk-snackbar-instance",
          n && "-cbwsdk-snackbar-instance-hidden",
          r && "-cbwsdk-snackbar-instance-expanded"
        ),
      },
      f(
        "div",
        { class: "-cbwsdk-snackbar-instance-header", onClick: o },
        f("img", { src: xn, class: "-cbwsdk-snackbar-instance-header-cblogo" }),
        " ",
        f("div", { class: "-cbwsdk-snackbar-instance-header-message" }, e),
        f(
          "div",
          { class: "-gear-container" },
          !r &&
            f(
              "svg",
              {
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
              },
              f("circle", { cx: "12", cy: "12", r: "12", fill: "#F5F7F8" })
            ),
          f("img", { src: kn, class: "-gear-icon", title: "Expand" })
        )
      ),
      s &&
        s.length > 0 &&
        f(
          "div",
          { class: "-cbwsdk-snackbar-instance-menu" },
          s.map((c, d) =>
            f(
              "div",
              {
                class: q(
                  "-cbwsdk-snackbar-instance-menu-item",
                  c.isRed && "-cbwsdk-snackbar-instance-menu-item-is-red"
                ),
                onClick: c.onClick,
                key: d,
              },
              f(
                "svg",
                {
                  width: c.svgWidth,
                  height: c.svgHeight,
                  viewBox: "0 0 10 11",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                },
                f("path", {
                  "fill-rule": c.defaultFillRule,
                  "clip-rule": c.defaultClipRule,
                  d: c.path,
                  fill: "#AAAAAA",
                })
              ),
              f(
                "span",
                {
                  class: q(
                    "-cbwsdk-snackbar-instance-menu-item-info",
                    c.isRed && "-cbwsdk-snackbar-instance-menu-item-info-is-red"
                  ),
                },
                c.info
              )
            )
          )
        )
    );
  };
class In {
  constructor() {
    (this.attached = !1), (this.snackbar = new En());
  }
  attach() {
    if (this.attached)
      throw new Error("Coinbase Wallet SDK UI is already attached");
    const e = document.documentElement,
      s = document.createElement("div");
    (s.className = "-cbwsdk-css-reset"),
      e.appendChild(s),
      this.snackbar.attach(s),
      (this.attached = !0),
      It();
  }
  showConnecting(e) {
    let s;
    return (
      e.isUnlinkedErrorState
        ? (s = {
            autoExpand: !0,
            message: "Connection lost",
            menuItems: [
              {
                isRed: !1,
                info: "Reset connection",
                svgWidth: "10",
                svgHeight: "11",
                path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
                defaultFillRule: "evenodd",
                defaultClipRule: "evenodd",
                onClick: e.onResetConnection,
              },
            ],
          })
        : (s = {
            message: "Confirm on phone",
            menuItems: [
              {
                isRed: !0,
                info: "Cancel transaction",
                svgWidth: "11",
                svgHeight: "11",
                path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
                defaultFillRule: "inherit",
                defaultClipRule: "inherit",
                onClick: e.onCancel,
              },
              {
                isRed: !1,
                info: "Reset connection",
                svgWidth: "10",
                svgHeight: "11",
                path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
                defaultFillRule: "evenodd",
                defaultClipRule: "evenodd",
                onClick: e.onResetConnection,
              },
            ],
          }),
      this.snackbar.presentItem(s)
    );
  }
}
const Sn = (() =>
  ".-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;transition:opacity .25s;background-color:rgba(10,11,13,.5)}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop-hidden{opacity:0}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box{display:block;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:20px;border-radius:8px;background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box p{display:block;font-weight:400;font-size:14px;line-height:20px;padding-bottom:12px;color:#5b636e}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box button{appearance:none;border:none;background:none;color:#0052ff;padding:0;text-decoration:none;display:block;font-weight:600;font-size:16px;line-height:24px}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark{background-color:#0a0b0d;color:#fff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark button{color:#0052ff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light{background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light button{color:#0052ff}")();
class An {
  constructor() {
    (this.root = null), (this.darkMode = Ct());
  }
  attach() {
    const e = document.documentElement;
    (this.root = document.createElement("div")),
      (this.root.className = "-cbwsdk-css-reset"),
      e.appendChild(this.root),
      It();
  }
  present(e) {
    this.render(e);
  }
  clear() {
    this.render(null);
  }
  render(e) {
    !this.root ||
      (le(null, this.root),
      e &&
        le(
          f(
            _n,
            Object.assign({}, e, {
              onDismiss: () => {
                this.clear();
              },
              darkMode: this.darkMode,
            })
          ),
          this.root
        ));
  }
}
const _n = ({
    title: t,
    buttonText: e,
    darkMode: s,
    onButtonClick: n,
    onDismiss: i,
  }) => {
    const r = s ? "dark" : "light";
    return f(
      St,
      { darkMode: s },
      f(
        "div",
        { class: "-cbwsdk-redirect-dialog" },
        f("style", null, Sn),
        f("div", { class: "-cbwsdk-redirect-dialog-backdrop", onClick: i }),
        f(
          "div",
          { class: q("-cbwsdk-redirect-dialog-box", r) },
          f("p", null, t),
          f("button", { onClick: n }, e)
        )
      )
    );
  },
  Mn = "https://keys.coinbase.com/connect",
  Ln = "http://rpc.wallet.coinbase.com",
  He = "https://www.walletlink.org",
  Pn = "https://go.cb-w.com/walletlink";
class Be {
  constructor() {
    (this.attached = !1), (this.redirectDialog = new An());
  }
  attach() {
    if (this.attached)
      throw new Error("Coinbase Wallet SDK UI is already attached");
    this.redirectDialog.attach(), (this.attached = !0);
  }
  redirectToCoinbaseWallet(e) {
    const s = new URL(Pn);
    s.searchParams.append("redirect_url", mn().href),
      e && s.searchParams.append("wl_url", e);
    const n = document.createElement("a");
    (n.target = "cbw-opener"),
      (n.href = s.href),
      (n.rel = "noreferrer noopener"),
      n.click();
  }
  openCoinbaseWalletDeeplink(e) {
    this.redirectDialog.present({
      title: "Redirecting to Coinbase Wallet...",
      buttonText: "Open",
      onButtonClick: () => {
        this.redirectToCoinbaseWallet(e);
      },
    }),
      setTimeout(() => {
        this.redirectToCoinbaseWallet(e);
      }, 99);
  }
  showConnecting(e) {
    return () => {
      this.redirectDialog.clear();
    };
  }
}
class S {
  constructor(e) {
    (this.chainCallbackParams = { chainId: "", jsonRpcUrl: "" }),
      (this.isMobileWeb = wn()),
      (this.linkedUpdated = (r) => {
        this.isLinked = r;
        const a = this.storage.getItem(pe);
        if (
          (r && (this._session.linked = r), (this.isUnlinkedErrorState = !1), a)
        ) {
          const o = a.split(" "),
            c = this.storage.getItem("IsStandaloneSigning") === "true";
          o[0] !== "" &&
            !r &&
            this._session.linked &&
            !c &&
            (this.isUnlinkedErrorState = !0);
        }
      }),
      (this.metadataUpdated = (r, a) => {
        this.storage.setItem(r, a);
      }),
      (this.chainUpdated = (r, a) => {
        (this.chainCallbackParams.chainId === r &&
          this.chainCallbackParams.jsonRpcUrl === a) ||
          ((this.chainCallbackParams = { chainId: r, jsonRpcUrl: a }),
          this.chainCallback && this.chainCallback(a, Number.parseInt(r, 10)));
      }),
      (this.accountUpdated = (r) => {
        this.accountsCallback && this.accountsCallback([r]),
          S.accountRequestCallbackIds.size > 0 &&
            (Array.from(S.accountRequestCallbackIds.values()).forEach((a) => {
              this.invokeCallback(a, {
                method: "requestEthereumAccounts",
                result: [r],
              });
            }),
            S.accountRequestCallbackIds.clear());
      }),
      (this.resetAndReload = this.resetAndReload.bind(this)),
      (this.linkAPIUrl = e.linkAPIUrl),
      (this.storage = e.storage),
      (this.metadata = e.metadata),
      (this.accountsCallback = e.accountsCallback),
      (this.chainCallback = e.chainCallback);
    const { session: s, ui: n, connection: i } = this.subscribe();
    (this._session = s),
      (this.connection = i),
      (this.relayEventManager = new gn()),
      (this.ui = n),
      this.ui.attach();
  }
  subscribe() {
    const e = U.load(this.storage) || U.create(this.storage),
      { linkAPIUrl: s } = this,
      n = new pn({ session: e, linkAPIUrl: s, listener: this }),
      i = this.isMobileWeb ? new Be() : new In();
    return n.connect(), { session: e, ui: i, connection: n };
  }
  resetAndReload() {
    this.connection
      .destroy()
      .then(() => {
        const e = U.load(this.storage);
        e?.id === this._session.id && x.clearAll(), document.location.reload();
      })
      .catch((e) => {});
  }
  signEthereumTransaction(e) {
    return this.sendRequest({
      method: "signEthereumTransaction",
      params: {
        fromAddress: e.fromAddress,
        toAddress: e.toAddress,
        weiValue: E(e.weiValue),
        data: K(e.data, !0),
        nonce: e.nonce,
        gasPriceInWei: e.gasPriceInWei ? E(e.gasPriceInWei) : null,
        maxFeePerGas: e.gasPriceInWei ? E(e.gasPriceInWei) : null,
        maxPriorityFeePerGas: e.gasPriceInWei ? E(e.gasPriceInWei) : null,
        gasLimit: e.gasLimit ? E(e.gasLimit) : null,
        chainId: e.chainId,
        shouldSubmit: !1,
      },
    });
  }
  signAndSubmitEthereumTransaction(e) {
    return this.sendRequest({
      method: "signEthereumTransaction",
      params: {
        fromAddress: e.fromAddress,
        toAddress: e.toAddress,
        weiValue: E(e.weiValue),
        data: K(e.data, !0),
        nonce: e.nonce,
        gasPriceInWei: e.gasPriceInWei ? E(e.gasPriceInWei) : null,
        maxFeePerGas: e.maxFeePerGas ? E(e.maxFeePerGas) : null,
        maxPriorityFeePerGas: e.maxPriorityFeePerGas
          ? E(e.maxPriorityFeePerGas)
          : null,
        gasLimit: e.gasLimit ? E(e.gasLimit) : null,
        chainId: e.chainId,
        shouldSubmit: !0,
      },
    });
  }
  submitEthereumTransaction(e, s) {
    return this.sendRequest({
      method: "submitEthereumTransaction",
      params: { signedTransaction: K(e, !0), chainId: s },
    });
  }
  getWalletLinkSession() {
    return this._session;
  }
  sendRequest(e) {
    let s = null;
    const n = T(8),
      i = (r) => {
        this.publishWeb3RequestCanceledEvent(n),
          this.handleErrorResponse(n, e.method, r),
          s?.();
      };
    return new Promise((r, a) => {
      (s = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: i,
        onResetConnection: this.resetAndReload,
      })),
        this.relayEventManager.callbacks.set(n, (o) => {
          if ((s?.(), m(o))) return a(new Error(o.errorMessage));
          r(o);
        }),
        this.publishWeb3RequestEvent(n, e);
    });
  }
  publishWeb3RequestEvent(e, s) {
    const n = { type: "WEB3_REQUEST", id: e, request: s };
    this.publishEvent("Web3Request", n, !0)
      .then((i) => {})
      .catch((i) => {
        this.handleWeb3ResponseMessage(n.id, {
          method: s.method,
          errorMessage: i.message,
        });
      }),
      this.isMobileWeb && this.openCoinbaseWalletDeeplink(s.method);
  }
  openCoinbaseWalletDeeplink(e) {
    if (this.ui instanceof Be)
      switch (e) {
        case "requestEthereumAccounts":
        case "switchEthereumChain":
          return;
        default:
          window.addEventListener(
            "blur",
            () => {
              window.addEventListener(
                "focus",
                () => {
                  this.connection.checkUnseenEvents();
                },
                { once: !0 }
              );
            },
            { once: !0 }
          ),
            this.ui.openCoinbaseWalletDeeplink();
          break;
      }
  }
  publishWeb3RequestCanceledEvent(e) {
    const s = { type: "WEB3_REQUEST_CANCELED", id: e };
    this.publishEvent("Web3RequestCanceled", s, !1).then();
  }
  publishEvent(e, s, n) {
    return this.connection.publishEvent(e, s, n);
  }
  handleWeb3ResponseMessage(e, s) {
    if (s.method === "requestEthereumAccounts") {
      S.accountRequestCallbackIds.forEach((n) => this.invokeCallback(n, s)),
        S.accountRequestCallbackIds.clear();
      return;
    }
    this.invokeCallback(e, s);
  }
  handleErrorResponse(e, s, n) {
    var i;
    const r =
      (i = n?.message) !== null && i !== void 0
        ? i
        : "Unspecified error message.";
    this.handleWeb3ResponseMessage(e, { method: s, errorMessage: r });
  }
  invokeCallback(e, s) {
    const n = this.relayEventManager.callbacks.get(e);
    n && (n(s), this.relayEventManager.callbacks.delete(e));
  }
  requestEthereumAccounts() {
    const { appName: e, appLogoUrl: s } = this.metadata,
      n = {
        method: "requestEthereumAccounts",
        params: { appName: e, appLogoUrl: s },
      },
      i = T(8);
    return new Promise((r, a) => {
      this.relayEventManager.callbacks.set(i, (o) => {
        if (m(o)) return a(new Error(o.errorMessage));
        r(o);
      }),
        S.accountRequestCallbackIds.add(i),
        this.publishWeb3RequestEvent(i, n);
    });
  }
  watchAsset(e, s, n, i, r, a) {
    const o = {
      method: "watchAsset",
      params: {
        type: e,
        options: { address: s, symbol: n, decimals: i, image: r },
        chainId: a,
      },
    };
    let c = null;
    const d = T(8),
      h = (l) => {
        this.publishWeb3RequestCanceledEvent(d),
          this.handleErrorResponse(d, o.method, l),
          c?.();
      };
    return (
      (c = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: h,
        onResetConnection: this.resetAndReload,
      })),
      new Promise((l, p) => {
        this.relayEventManager.callbacks.set(d, (g) => {
          if ((c?.(), m(g))) return p(new Error(g.errorMessage));
          l(g);
        }),
          this.publishWeb3RequestEvent(d, o);
      })
    );
  }
  addEthereumChain(e, s, n, i, r, a) {
    const o = {
      method: "addEthereumChain",
      params: {
        chainId: e,
        rpcUrls: s,
        blockExplorerUrls: i,
        chainName: r,
        iconUrls: n,
        nativeCurrency: a,
      },
    };
    let c = null;
    const d = T(8),
      h = (l) => {
        this.publishWeb3RequestCanceledEvent(d),
          this.handleErrorResponse(d, o.method, l),
          c?.();
      };
    return (
      (c = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: h,
        onResetConnection: this.resetAndReload,
      })),
      new Promise((l, p) => {
        this.relayEventManager.callbacks.set(d, (g) => {
          if ((c?.(), m(g))) return p(new Error(g.errorMessage));
          l(g);
        }),
          this.publishWeb3RequestEvent(d, o);
      })
    );
  }
  switchEthereumChain(e, s) {
    const n = {
      method: "switchEthereumChain",
      params: Object.assign({ chainId: e }, { address: s }),
    };
    let i = null;
    const r = T(8),
      a = (o) => {
        this.publishWeb3RequestCanceledEvent(r),
          this.handleErrorResponse(r, n.method, o),
          i?.();
      };
    return (
      (i = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: a,
        onResetConnection: this.resetAndReload,
      })),
      new Promise((o, c) => {
        this.relayEventManager.callbacks.set(r, (d) => {
          if ((i?.(), m(d) && d.errorCode))
            return c(
              u.provider.custom({
                code: d.errorCode,
                message:
                  "Unrecognized chain ID. Try adding the chain using addEthereumChain first.",
              })
            );
          if (m(d)) return c(new Error(d.errorMessage));
          o(d);
        }),
          this.publishWeb3RequestEvent(r, n);
      })
    );
  }
}
S.accountRequestCallbackIds = new Set();
const We = "DefaultChainId",
  qe = "DefaultJsonRpcUrl";
class At {
  constructor(e) {
    (this._relay = null),
      (this._addresses = []),
      (this.metadata = e.metadata),
      (this._storage = new x("walletlink", He)),
      (this.callback = e.callback || null);
    const s = this._storage.getItem(pe);
    if (s) {
      const n = s.split(" ");
      n[0] !== "" && (this._addresses = n.map((i) => L(i)));
    }
    this.initializeRelay();
  }
  getSession() {
    const e = this.initializeRelay(),
      { id: s, secret: n } = e.getWalletLinkSession();
    return { id: s, secret: n };
  }
  async handshake() {
    await this._eth_requestAccounts();
  }
  get selectedAddress() {
    return this._addresses[0] || void 0;
  }
  get jsonRpcUrl() {
    var e;
    return (e = this._storage.getItem(qe)) !== null && e !== void 0
      ? e
      : void 0;
  }
  set jsonRpcUrl(e) {
    this._storage.setItem(qe, e);
  }
  updateProviderInfo(e, s) {
    var n;
    this.jsonRpcUrl = e;
    const i = this.getChainId();
    this._storage.setItem(We, s.toString(10)),
      V(s) !== i &&
        ((n = this.callback) === null ||
          n === void 0 ||
          n.call(this, "chainChanged", P(s)));
  }
  async watchAsset(e) {
    const s = Array.isArray(e) ? e[0] : e;
    if (!s.type) throw u.rpc.invalidParams("Type is required");
    if (s?.type !== "ERC20")
      throw u.rpc.invalidParams(`Asset of type '${s.type}' is not supported`);
    if (!s?.options) throw u.rpc.invalidParams("Options are required");
    if (!s?.options.address) throw u.rpc.invalidParams("Address is required");
    const n = this.getChainId(),
      { address: i, symbol: r, image: a, decimals: o } = s.options,
      d = await this.initializeRelay().watchAsset(
        s.type,
        i,
        r,
        o,
        a,
        n?.toString()
      );
    return m(d) ? !1 : !!d.result;
  }
  async addEthereumChain(e) {
    var s, n;
    const i = e[0];
    if (((s = i.rpcUrls) === null || s === void 0 ? void 0 : s.length) === 0)
      throw u.rpc.invalidParams("please pass in at least 1 rpcUrl");
    if (!i.chainName || i.chainName.trim() === "")
      throw u.rpc.invalidParams("chainName is a required field");
    if (!i.nativeCurrency)
      throw u.rpc.invalidParams("nativeCurrency is a required field");
    const r = Number.parseInt(i.chainId, 16);
    if (r === this.getChainId()) return !1;
    const a = this.initializeRelay(),
      {
        rpcUrls: o = [],
        blockExplorerUrls: c = [],
        chainName: d,
        iconUrls: h = [],
        nativeCurrency: l,
      } = i,
      p = await a.addEthereumChain(r.toString(), o, h, c, d, l);
    if (m(p)) return !1;
    if (
      ((n = p.result) === null || n === void 0 ? void 0 : n.isApproved) === !0
    )
      return this.updateProviderInfo(o[0], r), null;
    throw u.rpc.internal("unable to add ethereum chain");
  }
  async switchEthereumChain(e) {
    const s = e[0],
      n = Number.parseInt(s.chainId, 16),
      r = await this.initializeRelay().switchEthereumChain(
        n.toString(10),
        this.selectedAddress || void 0
      );
    if (m(r)) throw r;
    const a = r.result;
    return (
      a.isApproved &&
        a.rpcUrl.length > 0 &&
        this.updateProviderInfo(a.rpcUrl, n),
      null
    );
  }
  async cleanup() {
    (this.callback = null),
      this._relay && this._relay.resetAndReload(),
      this._storage.clear();
  }
  _setAddresses(e, s) {
    var n;
    if (!Array.isArray(e)) throw new Error("addresses is not an array");
    const i = e.map((r) => L(r));
    JSON.stringify(i) !== JSON.stringify(this._addresses) &&
      ((this._addresses = i),
      (n = this.callback) === null ||
        n === void 0 ||
        n.call(this, "accountsChanged", i),
      this._storage.setItem(pe, i.join(" ")));
  }
  async request(e) {
    const s = e.params || [];
    switch (e.method) {
      case "eth_accounts":
        return [...this._addresses];
      case "eth_coinbase":
        return this.selectedAddress || null;
      case "net_version":
        return this.getChainId().toString(10);
      case "eth_chainId":
        return P(this.getChainId());
      case "eth_requestAccounts":
        return this._eth_requestAccounts();
      case "eth_ecRecover":
      case "personal_ecRecover":
        return this.ecRecover(e);
      case "personal_sign":
        return this.personalSign(e);
      case "eth_signTransaction":
        return this._eth_signTransaction(s);
      case "eth_sendRawTransaction":
        return this._eth_sendRawTransaction(s);
      case "eth_sendTransaction":
        return this._eth_sendTransaction(s);
      case "eth_signTypedData_v1":
      case "eth_signTypedData_v3":
      case "eth_signTypedData_v4":
      case "eth_signTypedData":
        return this.signTypedData(e);
      case "wallet_addEthereumChain":
        return this.addEthereumChain(s);
      case "wallet_switchEthereumChain":
        return this.switchEthereumChain(s);
      case "wallet_watchAsset":
        return this.watchAsset(s);
      default:
        if (!this.jsonRpcUrl) throw u.rpc.internal("No RPC URL set for chain");
        return ve(e, this.jsonRpcUrl);
    }
  }
  _ensureKnownAddress(e) {
    const s = L(e);
    if (!this._addresses.map((i) => L(i)).includes(s))
      throw new Error("Unknown Ethereum address");
  }
  _prepareTransactionParams(e) {
    const s = e.from ? L(e.from) : this.selectedAddress;
    if (!s) throw new Error("Ethereum address is unavailable");
    this._ensureKnownAddress(s);
    const n = e.to ? L(e.to) : null,
      i = e.value != null ? W(e.value) : BigInt(0),
      r = e.data ? fe(e.data) : J.alloc(0),
      a = e.nonce != null ? V(e.nonce) : null,
      o = e.gasPrice != null ? W(e.gasPrice) : null,
      c = e.maxFeePerGas != null ? W(e.maxFeePerGas) : null,
      d = e.maxPriorityFeePerGas != null ? W(e.maxPriorityFeePerGas) : null,
      h = e.gas != null ? W(e.gas) : null,
      l = e.chainId ? V(e.chainId) : this.getChainId();
    return {
      fromAddress: s,
      toAddress: n,
      weiValue: i,
      data: r,
      nonce: a,
      gasPriceInWei: o,
      maxFeePerGas: c,
      maxPriorityFeePerGas: d,
      gasLimit: h,
      chainId: l,
    };
  }
  async ecRecover(e) {
    const { method: s, params: n } = e;
    if (!Array.isArray(n)) throw u.rpc.invalidParams();
    const r = await this.initializeRelay().sendRequest({
      method: "ethereumAddressFromSignedMessage",
      params: {
        message: re(n[0]),
        signature: re(n[1]),
        addPrefix: s === "personal_ecRecover",
      },
    });
    if (m(r)) throw r;
    return r.result;
  }
  getChainId() {
    var e;
    return Number.parseInt(
      (e = this._storage.getItem(We)) !== null && e !== void 0 ? e : "1",
      10
    );
  }
  async _eth_requestAccounts() {
    var e, s;
    if (this._addresses.length > 0)
      return (
        (e = this.callback) === null ||
          e === void 0 ||
          e.call(this, "connect", { chainId: P(this.getChainId()) }),
        this._addresses
      );
    const i = await this.initializeRelay().requestEthereumAccounts();
    if (m(i)) throw i;
    if (!i.result) throw new Error("accounts received is empty");
    return (
      this._setAddresses(i.result),
      (s = this.callback) === null ||
        s === void 0 ||
        s.call(this, "connect", { chainId: P(this.getChainId()) }),
      this._addresses
    );
  }
  async personalSign({ params: e }) {
    if (!Array.isArray(e)) throw u.rpc.invalidParams();
    const s = e[1],
      n = e[0];
    this._ensureKnownAddress(s);
    const r = await this.initializeRelay().sendRequest({
      method: "signEthereumMessage",
      params: {
        address: L(s),
        message: re(n),
        addPrefix: !0,
        typedDataJson: null,
      },
    });
    if (m(r)) throw r;
    return r.result;
  }
  async _eth_signTransaction(e) {
    const s = this._prepareTransactionParams(e[0] || {}),
      i = await this.initializeRelay().signEthereumTransaction(s);
    if (m(i)) throw i;
    return i.result;
  }
  async _eth_sendRawTransaction(e) {
    const s = fe(e[0]),
      i = await this.initializeRelay().submitEthereumTransaction(
        s,
        this.getChainId()
      );
    if (m(i)) throw i;
    return i.result;
  }
  async _eth_sendTransaction(e) {
    const s = this._prepareTransactionParams(e[0] || {}),
      i = await this.initializeRelay().signAndSubmitEthereumTransaction(s);
    if (m(i)) throw i;
    return i.result;
  }
  async signTypedData(e) {
    const { method: s, params: n } = e;
    if (!Array.isArray(n)) throw u.rpc.invalidParams();
    const i = (d) => {
        const h = {
          eth_signTypedData_v1: Y.hashForSignTypedDataLegacy,
          eth_signTypedData_v3: Y.hashForSignTypedData_v3,
          eth_signTypedData_v4: Y.hashForSignTypedData_v4,
          eth_signTypedData: Y.hashForSignTypedData_v4,
        };
        return K(h[s]({ data: Rs(d) }), !0);
      },
      r = n[s === "eth_signTypedData_v1" ? 1 : 0],
      a = n[s === "eth_signTypedData_v1" ? 0 : 1];
    this._ensureKnownAddress(r);
    const c = await this.initializeRelay().sendRequest({
      method: "signEthereumMessage",
      params: {
        address: L(r),
        message: i(a),
        typedDataJson: JSON.stringify(a, null, 2),
        addPrefix: !1,
      },
    });
    if (m(c)) throw c;
    return c.result;
  }
  initializeRelay() {
    return (
      this._relay ||
        (this._relay = new S({
          linkAPIUrl: He,
          storage: this._storage,
          metadata: this.metadata,
          accountsCallback: this._setAddresses.bind(this),
          chainCallback: this.updateProviderInfo.bind(this),
        })),
      this._relay
    );
  }
}
const _t = "SignerType",
  Mt = new x("CBWSDK", "SignerConfigurator");
function Rn() {
  return Mt.getItem(_t);
}
function Tn(t) {
  Mt.setItem(_t, t);
}
async function Dn(t) {
  const { communicator: e, metadata: s, handshakeRequest: n, callback: i } = t;
  On(e, s, i).catch(() => {});
  const r = {
      id: crypto.randomUUID(),
      event: "selectSignerType",
      data: Object.assign(Object.assign({}, t.preference), {
        handshakeRequest: n,
      }),
    },
    { data: a } = await e.postRequestAndWaitForResponse(r);
  return a;
}
function Nn(t) {
  const { signerType: e, metadata: s, communicator: n, callback: i } = t;
  switch (e) {
    case "scw":
      return new Fs({ metadata: s, callback: i, communicator: n });
    case "walletlink":
      return new At({ metadata: s, callback: i });
  }
}
async function On(t, e, s) {
  await t.onMessage(({ event: i }) => i === "WalletLinkSessionRequest");
  const n = new At({ metadata: e, callback: s });
  t.postMessage({
    event: "WalletLinkUpdate",
    data: { session: n.getSession() },
  }),
    await n.handshake(),
    t.postMessage({ event: "WalletLinkUpdate", data: { connected: !0 } });
}
const Un = `Coinbase Wallet SDK requires the Cross-Origin-Opener-Policy header to not be set to 'same-origin'. This is to ensure that the SDK can communicate with the Coinbase Smart Wallet app.

Please see https://www.smartwallet.dev/guides/tips/popup-tips#cross-origin-opener-policy for more information.`,
  jn = () => {
    let t;
    return {
      getCrossOriginOpenerPolicy: () => (t === void 0 ? "undefined" : t),
      checkCrossOriginOpenerPolicy: async () => {
        if (typeof window > "u") {
          t = "non-browser-env";
          return;
        }
        try {
          const e = `${window.location.origin}${window.location.pathname}`,
            s = await fetch(e, { method: "HEAD" });
          if (!s.ok) throw new Error(`HTTP error! status: ${s.status}`);
          const n = s.headers.get("Cross-Origin-Opener-Policy");
          (t = n ?? "null"), t === "same-origin" && console.error(Un);
        } catch (e) {
          console.error(
            "Error checking Cross-Origin-Opener-Policy:",
            e.message
          ),
            (t = "error");
        }
      },
    };
  },
  { checkCrossOriginOpenerPolicy: Lt, getCrossOriginOpenerPolicy: Hn } = jn(),
  Ke = 420,
  Ve = 540;
function Bn(t) {
  const e = (window.innerWidth - Ke) / 2 + window.screenX,
    s = (window.innerHeight - Ve) / 2 + window.screenY;
  qn(t);
  const n = `wallet_${crypto.randomUUID()}`,
    i = window.open(t, n, `width=${Ke}, height=${Ve}, left=${e}, top=${s}`);
  if ((i?.focus(), !i)) throw u.rpc.internal("Pop up window failed to open");
  return i;
}
function Wn(t) {
  t && !t.closed && t.close();
}
function qn(t) {
  const e = {
    sdkName: ut,
    sdkVersion: H,
    origin: window.location.origin,
    coop: Hn(),
  };
  for (const [s, n] of Object.entries(e))
    t.searchParams.append(s, n.toString());
}
class Kn {
  constructor({ url: e = Mn, metadata: s, preference: n }) {
    (this.popup = null),
      (this.listeners = new Map()),
      (this.postMessage = async (i) => {
        (await this.waitForPopupLoaded()).postMessage(i, this.url.origin);
      }),
      (this.postRequestAndWaitForResponse = async (i) => {
        const r = this.onMessage(({ requestId: a }) => a === i.id);
        return this.postMessage(i), await r;
      }),
      (this.onMessage = async (i) =>
        new Promise((r, a) => {
          const o = (c) => {
            if (c.origin !== this.url.origin) return;
            const d = c.data;
            i(d) &&
              (r(d),
              window.removeEventListener("message", o),
              this.listeners.delete(o));
          };
          window.addEventListener("message", o),
            this.listeners.set(o, { reject: a });
        })),
      (this.disconnect = () => {
        Wn(this.popup),
          (this.popup = null),
          this.listeners.forEach(({ reject: i }, r) => {
            i(u.provider.userRejectedRequest("Request rejected")),
              window.removeEventListener("message", r);
          }),
          this.listeners.clear();
      }),
      (this.waitForPopupLoaded = async () =>
        this.popup && !this.popup.closed
          ? (this.popup.focus(), this.popup)
          : ((this.popup = Bn(this.url)),
            this.onMessage(({ event: i }) => i === "PopupUnload")
              .then(this.disconnect)
              .catch(() => {}),
            this.onMessage(({ event: i }) => i === "PopupLoaded")
              .then((i) => {
                this.postMessage({
                  requestId: i.id,
                  data: {
                    version: H,
                    metadata: this.metadata,
                    preference: this.preference,
                    location: window.location.toString(),
                  },
                });
              })
              .then(() => {
                if (!this.popup) throw u.rpc.internal();
                return this.popup;
              }))),
      (this.url = new URL(e)),
      (this.metadata = s),
      (this.preference = n);
  }
}
function Vn(t) {
  const e = As(Fn(t), { shouldIncludeStack: !0 }),
    s = new URL("https://docs.cloud.coinbase.com/wallet-sdk/docs/errors");
  return (
    s.searchParams.set("version", H),
    s.searchParams.set("code", e.code.toString()),
    s.searchParams.set("message", e.message),
    Object.assign(Object.assign({}, e), { docUrl: s.href })
  );
}
function Fn(t) {
  var e;
  if (typeof t == "string") return { message: t, code: b.rpc.internal };
  if (m(t)) {
    const s = t.errorMessage,
      n =
        (e = t.errorCode) !== null && e !== void 0
          ? e
          : s.match(/(denied|rejected)/i)
          ? b.provider.userRejectedRequest
          : void 0;
    return Object.assign(Object.assign({}, t), {
      message: s,
      code: n,
      data: { method: t.method },
    });
  }
  return t;
}
class zn extends Dt {}
var Zn =
  (globalThis && globalThis.__rest) ||
  function (t, e) {
    var s = {};
    for (var n in t)
      Object.prototype.hasOwnProperty.call(t, n) &&
        e.indexOf(n) < 0 &&
        (s[n] = t[n]);
    if (t != null && typeof Object.getOwnPropertySymbols == "function")
      for (var i = 0, n = Object.getOwnPropertySymbols(t); i < n.length; i++)
        e.indexOf(n[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(t, n[i]) &&
          (s[n[i]] = t[n[i]]);
    return s;
  };
class Pt extends zn {
  constructor(e) {
    var { metadata: s } = e,
      n = e.preference,
      { keysUrl: i } = n,
      r = Zn(n, ["keysUrl"]);
    super(),
      (this.signer = null),
      (this.isCoinbaseWallet = !0),
      (this.metadata = s),
      (this.preference = r),
      (this.communicator = new Kn({ url: i, metadata: s, preference: r }));
    const a = Rn();
    a && (this.signer = this.initSigner(a));
  }
  async request(e) {
    try {
      if ((Vs(e), !this.signer))
        switch (e.method) {
          case "eth_requestAccounts": {
            const s = await this.requestSignerSelection(e),
              n = this.initSigner(s);
            await n.handshake(e), (this.signer = n), Tn(s);
            break;
          }
          case "wallet_sendCalls": {
            const s = this.initSigner("scw");
            await s.handshake({ method: "handshake" });
            const n = await s.request(e);
            return await s.cleanup(), n;
          }
          case "wallet_getCallsStatus":
            return ve(e, Ln);
          case "net_version":
            return 1;
          case "eth_chainId":
            return P(1);
          default:
            throw u.provider.unauthorized(
              "Must call 'eth_requestAccounts' before other methods"
            );
        }
      return await this.signer.request(e);
    } catch (s) {
      const { code: n } = s;
      return (
        n === b.provider.unauthorized && this.disconnect(),
        Promise.reject(Vn(s))
      );
    }
  }
  async enable() {
    return (
      console.warn(
        '.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.'
      ),
      await this.request({ method: "eth_requestAccounts" })
    );
  }
  async disconnect() {
    var e;
    await ((e = this.signer) === null || e === void 0 ? void 0 : e.cleanup()),
      (this.signer = null),
      x.clearAll(),
      this.emit(
        "disconnect",
        u.provider.disconnected("User initiated disconnection")
      );
  }
  requestSignerSelection(e) {
    return Dn({
      communicator: this.communicator,
      preference: this.preference,
      metadata: this.metadata,
      handshakeRequest: e,
      callback: this.emit.bind(this),
    });
  }
  initSigner(e) {
    return Nn({
      signerType: e,
      metadata: this.metadata,
      communicator: this.communicator,
      callback: this.emit.bind(this),
    });
  }
}
function Rt(t) {
  if (!!t) {
    if (!["all", "smartWalletOnly", "eoaOnly"].includes(t.options))
      throw new Error(`Invalid options: ${t.options}`);
    if (
      t.attribution &&
      t.attribution.auto !== void 0 &&
      t.attribution.dataSuffix !== void 0
    )
      throw new Error(
        "Attribution cannot contain both auto and dataSuffix properties"
      );
  }
}
class Qn {
  constructor(e) {
    (this.metadata = {
      appName: e.appName || "Dapp",
      appLogoUrl: e.appLogoUrl || Ds(),
      appChainIds: e.appChainIds || [],
    }),
      this.storeLatestVersion(),
      Lt();
  }
  makeWeb3Provider(e = { options: "all" }) {
    var s;
    Rt(e);
    const n = { metadata: this.metadata, preference: e };
    return (s = ft(n)) !== null && s !== void 0 ? s : new Pt(n);
  }
  getCoinbaseWalletLogo(e, s = 240) {
    return Cs(e, s);
  }
  storeLatestVersion() {
    new x("CBWSDK").setItem("VERSION", H);
  }
}
function Gn(t) {
  var e;
  const s = { metadata: t.metadata, preference: t.preference };
  return (e = ft(s)) !== null && e !== void 0 ? e : new Pt(s);
}
const $n = { options: "all" };
function Xn(t) {
  var e;
  new x("CBWSDK").setItem("VERSION", H), Lt();
  const n = {
    metadata: {
      appName: t.appName || "Dapp",
      appLogoUrl: t.appLogoUrl || "",
      appChainIds: t.appChainIds || [],
    },
    preference: Object.assign(
      $n,
      (e = t.preference) !== null && e !== void 0 ? e : {}
    ),
  };
  Rt(n.preference);
  let i = null;
  return { getProvider: () => (i || (i = Gn(n)), i) };
}
export {
  Qn as CoinbaseWalletSDK,
  Xn as createCoinbaseWalletSDK,
  Qn as default,
};
