var g;
(function(r) {
  r.assertEqual = (n) => n;
  function e(n) {
  }
  r.assertIs = e;
  function t(n) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (n) => {
    const a = {};
    for (const o of n)
      a[o] = o;
    return a;
  }, r.getValidEnumValues = (n) => {
    const a = r.objectKeys(n).filter((i) => typeof n[n[i]] != "number"), o = {};
    for (const i of a)
      o[i] = n[i];
    return r.objectValues(o);
  }, r.objectValues = (n) => r.objectKeys(n).map(function(a) {
    return n[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const a = [];
    for (const o in n)
      Object.prototype.hasOwnProperty.call(n, o) && a.push(o);
    return a;
  }, r.find = (n, a) => {
    for (const o of n)
      if (a(o))
        return o;
  }, r.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.floor(n) === n;
  function s(n, a = " | ") {
    return n.map((o) => typeof o == "string" ? `'${o}'` : o).join(a);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (n, a) => typeof a == "bigint" ? a.toString() : a;
})(g || (g = {}));
var xe;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(xe || (xe = {}));
const f = g.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), I = (r) => {
  switch (typeof r) {
    case "undefined":
      return f.undefined;
    case "string":
      return f.string;
    case "number":
      return isNaN(r) ? f.nan : f.number;
    case "boolean":
      return f.boolean;
    case "function":
      return f.function;
    case "bigint":
      return f.bigint;
    case "symbol":
      return f.symbol;
    case "object":
      return Array.isArray(r) ? f.array : r === null ? f.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? f.promise : typeof Map < "u" && r instanceof Map ? f.map : typeof Set < "u" && r instanceof Set ? f.set : typeof Date < "u" && r instanceof Date ? f.date : f.object;
    default:
      return f.unknown;
  }
}, d = g.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), Pe = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class T extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, s = { _errors: [] }, n = (a) => {
      for (const o of a.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(n);
        else if (o.code === "invalid_return_type")
          n(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          n(o.argumentsError);
        else if (o.path.length === 0)
          s._errors.push(t(o));
        else {
          let i = s, c = 0;
          for (; c < o.path.length; ) {
            const u = o.path[c];
            c === o.path.length - 1 ? (i[u] = i[u] || { _errors: [] }, i[u]._errors.push(t(o))) : i[u] = i[u] || { _errors: [] }, i = i[u], c++;
          }
        }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof T))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, g.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const n of this.issues)
      n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
T.create = (r) => new T(r);
const W = (r, e) => {
  let t;
  switch (r.code) {
    case d.invalid_type:
      r.received === f.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case d.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, g.jsonStringifyReplacer)}`;
      break;
    case d.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${g.joinValues(r.keys, ", ")}`;
      break;
    case d.invalid_union:
      t = "Invalid input";
      break;
    case d.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${g.joinValues(r.options)}`;
      break;
    case d.invalid_enum_value:
      t = `Invalid enum value. Expected ${g.joinValues(r.options)}, received '${r.received}'`;
      break;
    case d.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case d.invalid_return_type:
      t = "Invalid function return type";
      break;
    case d.invalid_date:
      t = "Invalid date";
      break;
    case d.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : g.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case d.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case d.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case d.custom:
      t = "Invalid input";
      break;
    case d.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case d.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, g.assertNever(r);
  }
  return { message: t };
};
let Ee = W;
function ze(r) {
  Ee = r;
}
function ue() {
  return Ee;
}
const le = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: n } = r, a = [...t, ...n.path || []], o = {
    ...n,
    path: a
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: a,
      message: n.message
    };
  let i = "";
  const c = s.filter((u) => !!u).slice().reverse();
  for (const u of c)
    i = u(o, { data: e, defaultError: i }).message;
  return {
    ...n,
    path: a,
    message: i
  };
}, De = [];
function l(r, e) {
  const t = ue(), s = le({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === W ? void 0 : W
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
}
class b {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const n of t) {
      if (n.status === "aborted")
        return y;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const n of t) {
      const a = await n.key, o = await n.value;
      s.push({
        key: a,
        value: o
      });
    }
    return b.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: a, value: o } = n;
      if (a.status === "aborted" || o.status === "aborted")
        return y;
      a.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof o.value < "u" || n.alwaysSet) && (s[a.value] = o.value);
    }
    return { status: e.value, value: s };
  }
}
const y = Object.freeze({
  status: "aborted"
}), U = (r) => ({ status: "dirty", value: r }), w = (r) => ({ status: "valid", value: r }), ke = (r) => r.status === "aborted", be = (r) => r.status === "dirty", G = (r) => r.status === "valid", X = (r) => typeof Promise < "u" && r instanceof Promise;
function fe(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !s : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function Ne(r, e, t, s, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var h;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e?.message;
})(h || (h = {}));
var Y, H;
class N {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Se = (r, e) => {
  if (G(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new T(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function v(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (o, i) => {
    var c, u;
    const { message: p } = r;
    return o.code === "invalid_enum_value" ? { message: p ?? i.defaultError } : typeof i.data > "u" ? { message: (c = p ?? s) !== null && c !== void 0 ? c : i.defaultError } : o.code !== "invalid_type" ? { message: i.defaultError } : { message: (u = p ?? t) !== null && u !== void 0 ? u : i.defaultError };
  }, description: n };
}
class _ {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return I(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: I(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new b(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: I(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (X(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    var s;
    const n = {
      common: {
        issues: [],
        async: (s = t?.async) !== null && s !== void 0 ? s : !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: I(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return Se(n, a);
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: I(e)
    }, n = this._parse({ data: e, path: s.path, parent: s }), a = await (X(n) ? n : Promise.resolve(n));
    return Se(s, a);
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, a) => {
      const o = e(n), i = () => a.addIssue({
        code: d.custom,
        ...s(n)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((c) => c ? !0 : (i(), !1)) : o ? !0 : (i(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1));
  }
  _refinement(e) {
    return new C({
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return E.create(this, this._def);
  }
  nullable() {
    return $.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return S.create(this, this._def);
  }
  promise() {
    return J.create(this, this._def);
  }
  or(e) {
    return ee.create([this, e], this._def);
  }
  and(e) {
    return te.create(this, e, this._def);
  }
  transform(e) {
    return new C({
      ...v(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ie({
      ...v(this._def),
      innerType: this,
      defaultValue: t,
      typeName: m.ZodDefault
    });
  }
  brand() {
    return new Te({
      typeName: m.ZodBranded,
      type: this,
      ...v(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new oe({
      ...v(this._def),
      innerType: this,
      catchValue: t,
      typeName: m.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return ce.create(this, e);
  }
  readonly() {
    return de.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Le = /^c[^\s-]{8,}$/i, Ue = /^[0-9a-z]+$/, Be = /^[0-9A-HJKMNP-TV-Z]{26}$/, We = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, qe = /^[a-z0-9_-]{21}$/i, Je = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ye = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, He = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let ge;
const Ge = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Xe = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, Qe = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Oe = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Ke = new RegExp(`^${Oe}$`);
function Re(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Fe(r) {
  return new RegExp(`^${Re(r)}$`);
}
function je(r) {
  let e = `${Oe}T${Re(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function et(r, e) {
  return !!((e === "v4" || !e) && Ge.test(r) || (e === "v6" || !e) && Xe.test(r));
}
class Z extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== f.string) {
      const a = this._getOrReturnCtx(e);
      return l(a, {
        code: d.invalid_type,
        expected: f.string,
        received: a.parsedType
      }), y;
    }
    const s = new b();
    let n;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (n = this._getOrReturnCtx(e, n), l(n, {
          code: d.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (n = this._getOrReturnCtx(e, n), l(n, {
          code: d.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "length") {
        const o = e.data.length > a.value, i = e.data.length < a.value;
        (o || i) && (n = this._getOrReturnCtx(e, n), o ? l(n, {
          code: d.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : i && l(n, {
          code: d.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), s.dirty());
      } else if (a.kind === "email")
        Ye.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "email",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "emoji")
        ge || (ge = new RegExp(He, "u")), ge.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "emoji",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "uuid")
        We.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "uuid",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "nanoid")
        qe.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "nanoid",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid")
        Le.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "cuid",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid2")
        Ue.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "cuid2",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "ulid")
        Be.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
          validation: "ulid",
          code: d.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), l(n, {
            validation: "url",
            code: d.invalid_string,
            message: a.message
          }), s.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        validation: "regex",
        code: d.invalid_string,
        message: a.message
      }), s.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), s.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "datetime" ? je(a).test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: "datetime",
        message: a.message
      }), s.dirty()) : a.kind === "date" ? Ke.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: "date",
        message: a.message
      }), s.dirty()) : a.kind === "time" ? Fe(a).test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.invalid_string,
        validation: "time",
        message: a.message
      }), s.dirty()) : a.kind === "duration" ? Je.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        validation: "duration",
        code: d.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "ip" ? et(e.data, a.version) || (n = this._getOrReturnCtx(e, n), l(n, {
        validation: "ip",
        code: d.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64" ? Qe.test(e.data) || (n = this._getOrReturnCtx(e, n), l(n, {
        validation: "base64",
        code: d.invalid_string,
        message: a.message
      }), s.dirty()) : g.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((n) => e.test(n), {
      validation: t,
      code: d.invalid_string,
      ...h.errToObj(s)
    });
  }
  _addCheck(e) {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...h.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...h.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h.errToObj(e) });
  }
  datetime(e) {
    var t, s;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: (t = e?.offset) !== null && t !== void 0 ? t : !1,
      local: (s = e?.local) !== null && s !== void 0 ? s : !1,
      ...h.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...h.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...h.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...h.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...h.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...h.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...h.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...h.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...h.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...h.errToObj(t)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, h.errToObj(e));
  }
  trim() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Z.create = (r) => {
  var e;
  return new Z({
    checks: [],
    typeName: m.ZodString,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
function tt(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, a = parseInt(r.toFixed(n).replace(".", "")), o = parseInt(e.toFixed(n).replace(".", ""));
  return a % o / Math.pow(10, n);
}
class A extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== f.number) {
      const a = this._getOrReturnCtx(e);
      return l(a, {
        code: d.invalid_type,
        expected: f.number,
        received: a.parsedType
      }), y;
    }
    let s;
    const n = new b();
    for (const a of this._def.checks)
      a.kind === "int" ? g.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), n.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? tt(e.data, a.value) !== 0 && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.not_finite,
        message: a.message
      }), n.dirty()) : g.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, h.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, h.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, h.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, h.toString(t));
  }
  setLimit(e, t, s, n) {
    return new A({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: h.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new A({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: h.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: h.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: h.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: h.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: h.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: h.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: h.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: h.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: h.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && g.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
A.create = (r) => new A({
  checks: [],
  typeName: m.ZodNumber,
  coerce: r?.coerce || !1,
  ...v(r)
});
class M extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== f.bigint) {
      const a = this._getOrReturnCtx(e);
      return l(a, {
        code: d.invalid_type,
        expected: f.bigint,
        received: a.parsedType
      }), y;
    }
    let s;
    const n = new b();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: d.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : g.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, h.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, h.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, h.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, h.toString(t));
  }
  setLimit(e, t, s, n) {
    return new M({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: h.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new M({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: h.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: h.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: h.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: h.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: h.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
M.create = (r) => {
  var e;
  return new M({
    checks: [],
    typeName: m.ZodBigInt,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
class Q extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== f.boolean) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.boolean,
        received: s.parsedType
      }), y;
    }
    return w(e.data);
  }
}
Q.create = (r) => new Q({
  typeName: m.ZodBoolean,
  coerce: r?.coerce || !1,
  ...v(r)
});
class z extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== f.date) {
      const a = this._getOrReturnCtx(e);
      return l(a, {
        code: d.invalid_type,
        expected: f.date,
        received: a.parsedType
      }), y;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return l(a, {
        code: d.invalid_date
      }), y;
    }
    const s = new b();
    let n;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), s.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n = this._getOrReturnCtx(e, n), l(n, {
        code: d.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), s.dirty()) : g.assertNever(a);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: h.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: h.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
z.create = (r) => new z({
  checks: [],
  coerce: r?.coerce || !1,
  typeName: m.ZodDate,
  ...v(r)
});
class he extends _ {
  _parse(e) {
    if (this._getType(e) !== f.symbol) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.symbol,
        received: s.parsedType
      }), y;
    }
    return w(e.data);
  }
}
he.create = (r) => new he({
  typeName: m.ZodSymbol,
  ...v(r)
});
class K extends _ {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.undefined,
        received: s.parsedType
      }), y;
    }
    return w(e.data);
  }
}
K.create = (r) => new K({
  typeName: m.ZodUndefined,
  ...v(r)
});
class F extends _ {
  _parse(e) {
    if (this._getType(e) !== f.null) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.null,
        received: s.parsedType
      }), y;
    }
    return w(e.data);
  }
}
F.create = (r) => new F({
  typeName: m.ZodNull,
  ...v(r)
});
class q extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return w(e.data);
  }
}
q.create = (r) => new q({
  typeName: m.ZodAny,
  ...v(r)
});
class P extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return w(e.data);
  }
}
P.create = (r) => new P({
  typeName: m.ZodUnknown,
  ...v(r)
});
class j extends _ {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return l(t, {
      code: d.invalid_type,
      expected: f.never,
      received: t.parsedType
    }), y;
  }
}
j.create = (r) => new j({
  typeName: m.ZodNever,
  ...v(r)
});
class pe extends _ {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.void,
        received: s.parsedType
      }), y;
    }
    return w(e.data);
  }
}
pe.create = (r) => new pe({
  typeName: m.ZodVoid,
  ...v(r)
});
class S extends _ {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== f.array)
      return l(t, {
        code: d.invalid_type,
        expected: f.array,
        received: t.parsedType
      }), y;
    if (n.exactLength !== null) {
      const o = t.data.length > n.exactLength.value, i = t.data.length < n.exactLength.value;
      (o || i) && (l(t, {
        code: o ? d.too_big : d.too_small,
        minimum: i ? n.exactLength.value : void 0,
        maximum: o ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (l(t, {
      code: d.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (l(t, {
      code: d.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, i) => n.type._parseAsync(new N(t, o, t.path, i)))).then((o) => b.mergeArray(s, o));
    const a = [...t.data].map((o, i) => n.type._parseSync(new N(t, o, t.path, i)));
    return b.mergeArray(s, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new S({
      ...this._def,
      minLength: { value: e, message: h.toString(t) }
    });
  }
  max(e, t) {
    return new S({
      ...this._def,
      maxLength: { value: e, message: h.toString(t) }
    });
  }
  length(e, t) {
    return new S({
      ...this._def,
      exactLength: { value: e, message: h.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
S.create = (r, e) => new S({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...v(e)
});
function L(r) {
  if (r instanceof x) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = E.create(L(s));
    }
    return new x({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof S ? new S({
    ...r._def,
    type: L(r.element)
  }) : r instanceof E ? E.create(L(r.unwrap())) : r instanceof $ ? $.create(L(r.unwrap())) : r instanceof O ? O.create(r.items.map((e) => L(e))) : r;
}
class x extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = g.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== f.object) {
      const u = this._getOrReturnCtx(e);
      return l(u, {
        code: d.invalid_type,
        expected: f.object,
        received: u.parsedType
      }), y;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: a, keys: o } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof j && this._def.unknownKeys === "strip"))
      for (const u in n.data)
        o.includes(u) || i.push(u);
    const c = [];
    for (const u of o) {
      const p = a[u], k = n.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: p._parse(new N(n, k, n.path, u)),
        alwaysSet: u in n.data
      });
    }
    if (this._def.catchall instanceof j) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const p of i)
          c.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: n.data[p] }
          });
      else if (u === "strict")
        i.length > 0 && (l(n, {
          code: d.unrecognized_keys,
          keys: i
        }), s.dirty());
      else if (u !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const p of i) {
        const k = n.data[p];
        c.push({
          key: { status: "valid", value: p },
          value: u._parse(
            new N(n, k, n.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const p of c) {
        const k = await p.key, Ze = await p.value;
        u.push({
          key: k,
          value: Ze,
          alwaysSet: p.alwaysSet
        });
      }
      return u;
    }).then((u) => b.mergeObjectSync(s, u)) : b.mergeObjectSync(s, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h.errToObj, new x({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var n, a, o, i;
          const c = (o = (a = (n = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(n, t, s).message) !== null && o !== void 0 ? o : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (i = h.errToObj(e).message) !== null && i !== void 0 ? i : c
          } : {
            message: c
          };
        }
      } : {}
    });
  }
  strip() {
    return new x({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new x({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new x({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new x({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: m.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new x({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return g.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return g.objectKeys(this.shape).forEach((s) => {
      e[s] || (t[s] = this.shape[s]);
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return L(this);
  }
  partial(e) {
    const t = {};
    return g.objectKeys(this.shape).forEach((s) => {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return g.objectKeys(this.shape).forEach((s) => {
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let a = this.shape[s];
        for (; a instanceof E; )
          a = a._def.innerType;
        t[s] = a;
      }
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ie(g.objectKeys(this.shape));
  }
}
x.create = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strip",
  catchall: j.create(),
  typeName: m.ZodObject,
  ...v(e)
});
x.strictCreate = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strict",
  catchall: j.create(),
  typeName: m.ZodObject,
  ...v(e)
});
x.lazycreate = (r, e) => new x({
  shape: r,
  unknownKeys: "strip",
  catchall: j.create(),
  typeName: m.ZodObject,
  ...v(e)
});
class ee extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(a) {
      for (const i of a)
        if (i.result.status === "valid")
          return i.result;
      for (const i of a)
        if (i.result.status === "dirty")
          return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((i) => new T(i.ctx.common.issues));
      return l(t, {
        code: d.invalid_union,
        unionErrors: o
      }), y;
    }
    if (t.common.async)
      return Promise.all(s.map(async (a) => {
        const o = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      })).then(n);
    {
      let a;
      const o = [];
      for (const c of s) {
        const u = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, p = c._parseSync({
          data: t.data,
          path: t.path,
          parent: u
        });
        if (p.status === "valid")
          return p;
        p.status === "dirty" && !a && (a = { result: p, ctx: u }), u.common.issues.length && o.push(u.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const i = o.map((c) => new T(c));
      return l(t, {
        code: d.invalid_union,
        unionErrors: i
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
ee.create = (r, e) => new ee({
  options: r,
  typeName: m.ZodUnion,
  ...v(e)
});
const R = (r) => r instanceof se ? R(r.schema) : r instanceof C ? R(r.innerType()) : r instanceof ne ? [r.value] : r instanceof V ? r.options : r instanceof ae ? g.objectValues(r.enum) : r instanceof ie ? R(r._def.innerType) : r instanceof K ? [void 0] : r instanceof F ? [null] : r instanceof E ? [void 0, ...R(r.unwrap())] : r instanceof $ ? [null, ...R(r.unwrap())] : r instanceof Te || r instanceof de ? R(r.unwrap()) : r instanceof oe ? R(r._def.innerType) : [];
class ve extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f.object)
      return l(t, {
        code: d.invalid_type,
        expected: f.object,
        received: t.parsedType
      }), y;
    const s = this.discriminator, n = t.data[s], a = this.optionsMap.get(n);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (l(t, {
      code: d.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
    }), y);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, s) {
    const n = /* @__PURE__ */ new Map();
    for (const a of t) {
      const o = R(a.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of o) {
        if (n.has(i))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        n.set(i, a);
      }
    }
    return new ve({
      typeName: m.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n,
      ...v(s)
    });
  }
}
function we(r, e) {
  const t = I(r), s = I(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === f.object && s === f.object) {
    const n = g.objectKeys(e), a = g.objectKeys(r).filter((i) => n.indexOf(i) !== -1), o = { ...r, ...e };
    for (const i of a) {
      const c = we(r[i], e[i]);
      if (!c.valid)
        return { valid: !1 };
      o[i] = c.data;
    }
    return { valid: !0, data: o };
  } else if (t === f.array && s === f.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let a = 0; a < r.length; a++) {
      const o = r[a], i = e[a], c = we(o, i);
      if (!c.valid)
        return { valid: !1 };
      n.push(c.data);
    }
    return { valid: !0, data: n };
  } else return t === f.date && s === f.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class te extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (a, o) => {
      if (ke(a) || ke(o))
        return y;
      const i = we(a.value, o.value);
      return i.valid ? ((be(a) || be(o)) && t.dirty(), { status: t.value, value: i.data }) : (l(s, {
        code: d.invalid_intersection_types
      }), y);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([a, o]) => n(a, o)) : n(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
te.create = (r, e, t) => new te({
  left: r,
  right: e,
  typeName: m.ZodIntersection,
  ...v(t)
});
class O extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== f.array)
      return l(s, {
        code: d.invalid_type,
        expected: f.array,
        received: s.parsedType
      }), y;
    if (s.data.length < this._def.items.length)
      return l(s, {
        code: d.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && s.data.length > this._def.items.length && (l(s, {
      code: d.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...s.data].map((o, i) => {
      const c = this._def.items[i] || this._def.rest;
      return c ? c._parse(new N(s, o, s.path, i)) : null;
    }).filter((o) => !!o);
    return s.common.async ? Promise.all(a).then((o) => b.mergeArray(t, o)) : b.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new O({
      ...this._def,
      rest: e
    });
  }
}
O.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new O({
    items: r,
    typeName: m.ZodTuple,
    rest: null,
    ...v(e)
  });
};
class re extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== f.object)
      return l(s, {
        code: d.invalid_type,
        expected: f.object,
        received: s.parsedType
      }), y;
    const n = [], a = this._def.keyType, o = this._def.valueType;
    for (const i in s.data)
      n.push({
        key: a._parse(new N(s, i, s.path, i)),
        value: o._parse(new N(s, s.data[i], s.path, i)),
        alwaysSet: i in s.data
      });
    return s.common.async ? b.mergeObjectAsync(t, n) : b.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof _ ? new re({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...v(s)
    }) : new re({
      keyType: Z.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...v(t)
    });
  }
}
class me extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== f.map)
      return l(s, {
        code: d.invalid_type,
        expected: f.map,
        received: s.parsedType
      }), y;
    const n = this._def.keyType, a = this._def.valueType, o = [...s.data.entries()].map(([i, c], u) => ({
      key: n._parse(new N(s, i, s.path, [u, "key"])),
      value: a._parse(new N(s, c, s.path, [u, "value"]))
    }));
    if (s.common.async) {
      const i = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of o) {
          const u = await c.key, p = await c.value;
          if (u.status === "aborted" || p.status === "aborted")
            return y;
          (u.status === "dirty" || p.status === "dirty") && t.dirty(), i.set(u.value, p.value);
        }
        return { status: t.value, value: i };
      });
    } else {
      const i = /* @__PURE__ */ new Map();
      for (const c of o) {
        const u = c.key, p = c.value;
        if (u.status === "aborted" || p.status === "aborted")
          return y;
        (u.status === "dirty" || p.status === "dirty") && t.dirty(), i.set(u.value, p.value);
      }
      return { status: t.value, value: i };
    }
  }
}
me.create = (r, e, t) => new me({
  valueType: e,
  keyType: r,
  typeName: m.ZodMap,
  ...v(t)
});
class D extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== f.set)
      return l(s, {
        code: d.invalid_type,
        expected: f.set,
        received: s.parsedType
      }), y;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (l(s, {
      code: d.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (l(s, {
      code: d.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function o(c) {
      const u = /* @__PURE__ */ new Set();
      for (const p of c) {
        if (p.status === "aborted")
          return y;
        p.status === "dirty" && t.dirty(), u.add(p.value);
      }
      return { status: t.value, value: u };
    }
    const i = [...s.data.values()].map((c, u) => a._parse(new N(s, c, s.path, u)));
    return s.common.async ? Promise.all(i).then((c) => o(c)) : o(i);
  }
  min(e, t) {
    return new D({
      ...this._def,
      minSize: { value: e, message: h.toString(t) }
    });
  }
  max(e, t) {
    return new D({
      ...this._def,
      maxSize: { value: e, message: h.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
D.create = (r, e) => new D({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...v(e)
});
class B extends _ {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f.function)
      return l(t, {
        code: d.invalid_type,
        expected: f.function,
        received: t.parsedType
      }), y;
    function s(i, c) {
      return le({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ue(),
          W
        ].filter((u) => !!u),
        issueData: {
          code: d.invalid_arguments,
          argumentsError: c
        }
      });
    }
    function n(i, c) {
      return le({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ue(),
          W
        ].filter((u) => !!u),
        issueData: {
          code: d.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof J) {
      const i = this;
      return w(async function(...c) {
        const u = new T([]), p = await i._def.args.parseAsync(c, a).catch((_e) => {
          throw u.addIssue(s(c, _e)), u;
        }), k = await Reflect.apply(o, this, p);
        return await i._def.returns._def.type.parseAsync(k, a).catch((_e) => {
          throw u.addIssue(n(k, _e)), u;
        });
      });
    } else {
      const i = this;
      return w(function(...c) {
        const u = i._def.args.safeParse(c, a);
        if (!u.success)
          throw new T([s(c, u.error)]);
        const p = Reflect.apply(o, this, u.data), k = i._def.returns.safeParse(p, a);
        if (!k.success)
          throw new T([n(p, k.error)]);
        return k.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new B({
      ...this._def,
      args: O.create(e).rest(P.create())
    });
  }
  returns(e) {
    return new B({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s) {
    return new B({
      args: e || O.create([]).rest(P.create()),
      returns: t || P.create(),
      typeName: m.ZodFunction,
      ...v(s)
    });
  }
}
class se extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
se.create = (r, e) => new se({
  getter: r,
  typeName: m.ZodLazy,
  ...v(e)
});
class ne extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return l(t, {
        received: t.data,
        code: d.invalid_literal,
        expected: this._def.value
      }), y;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ne.create = (r, e) => new ne({
  value: r,
  typeName: m.ZodLiteral,
  ...v(e)
});
function Ie(r, e) {
  return new V({
    values: r,
    typeName: m.ZodEnum,
    ...v(e)
  });
}
class V extends _ {
  constructor() {
    super(...arguments), Y.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return l(t, {
        expected: g.joinValues(s),
        received: t.parsedType,
        code: d.invalid_type
      }), y;
    }
    if (fe(this, Y) || Ne(this, Y, new Set(this._def.values)), !fe(this, Y).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return l(t, {
        received: t.data,
        code: d.invalid_enum_value,
        options: s
      }), y;
    }
    return w(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return V.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return V.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
Y = /* @__PURE__ */ new WeakMap();
V.create = Ie;
class ae extends _ {
  constructor() {
    super(...arguments), H.set(this, void 0);
  }
  _parse(e) {
    const t = g.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== f.string && s.parsedType !== f.number) {
      const n = g.objectValues(t);
      return l(s, {
        expected: g.joinValues(n),
        received: s.parsedType,
        code: d.invalid_type
      }), y;
    }
    if (fe(this, H) || Ne(this, H, new Set(g.getValidEnumValues(this._def.values))), !fe(this, H).has(e.data)) {
      const n = g.objectValues(t);
      return l(s, {
        received: s.data,
        code: d.invalid_enum_value,
        options: n
      }), y;
    }
    return w(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
H = /* @__PURE__ */ new WeakMap();
ae.create = (r, e) => new ae({
  values: r,
  typeName: m.ZodNativeEnum,
  ...v(e)
});
class J extends _ {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f.promise && t.common.async === !1)
      return l(t, {
        code: d.invalid_type,
        expected: f.promise,
        received: t.parsedType
      }), y;
    const s = t.parsedType === f.promise ? t.data : Promise.resolve(t.data);
    return w(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
J.create = (r, e) => new J({
  type: r,
  typeName: m.ZodPromise,
  ...v(e)
});
class C extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, a = {
      addIssue: (o) => {
        l(s, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
      const o = n.transform(s.data, a);
      if (s.common.async)
        return Promise.resolve(o).then(async (i) => {
          if (t.value === "aborted")
            return y;
          const c = await this._def.schema._parseAsync({
            data: i,
            path: s.path,
            parent: s
          });
          return c.status === "aborted" ? y : c.status === "dirty" || t.value === "dirty" ? U(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return y;
        const i = this._def.schema._parseSync({
          data: o,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? y : i.status === "dirty" || t.value === "dirty" ? U(i.value) : i;
      }
    }
    if (n.type === "refinement") {
      const o = (i) => {
        const c = n.refinement(i, a);
        if (s.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? y : (i.status === "dirty" && t.dirty(), o(i.value), { status: t.value, value: i.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => i.status === "aborted" ? y : (i.status === "dirty" && t.dirty(), o(i.value).then(() => ({ status: t.value, value: i.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!G(o))
          return o;
        const i = n.transform(o.value, a);
        if (i instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: i };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => G(o) ? Promise.resolve(n.transform(o.value, a)).then((i) => ({ status: t.value, value: i })) : o);
    g.assertNever(n);
  }
}
C.create = (r, e, t) => new C({
  schema: r,
  typeName: m.ZodEffects,
  effect: e,
  ...v(t)
});
C.createWithPreprocess = (r, e, t) => new C({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: m.ZodEffects,
  ...v(t)
});
class E extends _ {
  _parse(e) {
    return this._getType(e) === f.undefined ? w(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
E.create = (r, e) => new E({
  innerType: r,
  typeName: m.ZodOptional,
  ...v(e)
});
class $ extends _ {
  _parse(e) {
    return this._getType(e) === f.null ? w(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
$.create = (r, e) => new $({
  innerType: r,
  typeName: m.ZodNullable,
  ...v(e)
});
class ie extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === f.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ie.create = (r, e) => new ie({
  innerType: r,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...v(e)
});
class oe extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, n = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return X(n) ? n.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new T(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new T(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
oe.create = (r, e) => new oe({
  innerType: r,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...v(e)
});
class ye extends _ {
  _parse(e) {
    if (this._getType(e) !== f.nan) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: d.invalid_type,
        expected: f.nan,
        received: s.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
ye.create = (r) => new ye({
  typeName: m.ZodNaN,
  ...v(r)
});
const rt = Symbol("zod_brand");
class Te extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ce extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return a.status === "aborted" ? y : a.status === "dirty" ? (t.dirty(), U(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const n = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return n.status === "aborted" ? y : n.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new ce({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class de extends _ {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (G(n) && (n.value = Object.freeze(n.value)), n);
    return X(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
de.create = (r, e) => new de({
  innerType: r,
  typeName: m.ZodReadonly,
  ...v(e)
});
function Ae(r, e = {}, t) {
  return r ? q.create().superRefine((s, n) => {
    var a, o;
    if (!r(s)) {
      const i = typeof e == "function" ? e(s) : typeof e == "string" ? { message: e } : e, c = (o = (a = i.fatal) !== null && a !== void 0 ? a : t) !== null && o !== void 0 ? o : !0, u = typeof i == "string" ? { message: i } : i;
      n.addIssue({ code: "custom", ...u, fatal: c });
    }
  }) : q.create();
}
const st = {
  object: x.lazycreate
};
var m;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const nt = (r, e = {
  message: `Input not instance of ${r.name}`
}) => Ae((t) => t instanceof r, e), Me = Z.create, Ve = A.create, at = ye.create, it = M.create, $e = Q.create, ot = z.create, dt = he.create, ct = K.create, ut = F.create, lt = q.create, ft = P.create, ht = j.create, pt = pe.create, mt = S.create, yt = x.create, vt = x.strictCreate, _t = ee.create, gt = ve.create, xt = te.create, kt = O.create, bt = re.create, wt = me.create, Tt = D.create, Zt = B.create, St = se.create, Ct = ne.create, Et = V.create, Nt = ae.create, Ot = J.create, Ce = C.create, Rt = E.create, jt = $.create, It = C.createWithPreprocess, At = ce.create, Mt = () => Me().optional(), Vt = () => Ve().optional(), $t = () => $e().optional(), Pt = {
  string: (r) => Z.create({ ...r, coerce: !0 }),
  number: (r) => A.create({ ...r, coerce: !0 }),
  boolean: (r) => Q.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => M.create({ ...r, coerce: !0 }),
  date: (r) => z.create({ ...r, coerce: !0 })
}, zt = y;
var Dt = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: W,
  setErrorMap: ze,
  getErrorMap: ue,
  makeIssue: le,
  EMPTY_PATH: De,
  addIssueToContext: l,
  ParseStatus: b,
  INVALID: y,
  DIRTY: U,
  OK: w,
  isAborted: ke,
  isDirty: be,
  isValid: G,
  isAsync: X,
  get util() {
    return g;
  },
  get objectUtil() {
    return xe;
  },
  ZodParsedType: f,
  getParsedType: I,
  ZodType: _,
  datetimeRegex: je,
  ZodString: Z,
  ZodNumber: A,
  ZodBigInt: M,
  ZodBoolean: Q,
  ZodDate: z,
  ZodSymbol: he,
  ZodUndefined: K,
  ZodNull: F,
  ZodAny: q,
  ZodUnknown: P,
  ZodNever: j,
  ZodVoid: pe,
  ZodArray: S,
  ZodObject: x,
  ZodUnion: ee,
  ZodDiscriminatedUnion: ve,
  ZodIntersection: te,
  ZodTuple: O,
  ZodRecord: re,
  ZodMap: me,
  ZodSet: D,
  ZodFunction: B,
  ZodLazy: se,
  ZodLiteral: ne,
  ZodEnum: V,
  ZodNativeEnum: ae,
  ZodPromise: J,
  ZodEffects: C,
  ZodTransformer: C,
  ZodOptional: E,
  ZodNullable: $,
  ZodDefault: ie,
  ZodCatch: oe,
  ZodNaN: ye,
  BRAND: rt,
  ZodBranded: Te,
  ZodPipeline: ce,
  ZodReadonly: de,
  custom: Ae,
  Schema: _,
  ZodSchema: _,
  late: st,
  get ZodFirstPartyTypeKind() {
    return m;
  },
  coerce: Pt,
  any: lt,
  array: mt,
  bigint: it,
  boolean: $e,
  date: ot,
  discriminatedUnion: gt,
  effect: Ce,
  enum: Et,
  function: Zt,
  instanceof: nt,
  intersection: xt,
  lazy: St,
  literal: Ct,
  map: wt,
  nan: at,
  nativeEnum: Nt,
  never: ht,
  null: ut,
  nullable: jt,
  number: Ve,
  object: yt,
  oboolean: $t,
  onumber: Vt,
  optional: Rt,
  ostring: Mt,
  pipeline: At,
  preprocess: It,
  promise: Ot,
  record: bt,
  set: Tt,
  strictObject: vt,
  string: Me,
  symbol: dt,
  transformer: Ce,
  tuple: kt,
  undefined: ct,
  union: _t,
  unknown: ft,
  void: pt,
  NEVER: zt,
  ZodIssueCode: d,
  quotelessJson: Pe,
  ZodError: T
});
const Lt = function(r) {
  r.magic("z", () => Dt);
  const e = (a, o = !1) => {
    const i = r.$data(a);
    return o ? JSON.parse(JSON.stringify(i)) : i;
  }, t = (a) => {
    if (typeof a != "object")
      throw new Error("ZValidate: x-data must be an object to use the zvalidate directive.");
    if (!a.zValidateSchema)
      throw new Error("ZValidate: zValidateSchema property is required on x-data model.");
    if (!(a.zValidateSchema instanceof _) || !(a.zValidateSchema instanceof x))
      throw new Error("ZValidate: zValidateSchema must be an instance of a Zod object.");
  }, s = (a) => Object.entries(a.format()).reduce((o, [i, c]) => (i !== "_errors" && Array.isArray(c._errors) && (o[i] = c._errors[0]), o), {}), n = (a) => {
    const { zValidateSchema: o } = r.$data(a);
    return {
      errors: {},
      successes: [],
      isValid(i) {
        return this.successes.includes(i);
      },
      hasError(i) {
        return i in this.errors;
      },
      getError(i) {
        return this.errors[i] ?? null;
      },
      reset() {
        this.errors = {}, this.successes = [];
      },
      validate() {
        const i = o.safeParse(e(a, !0));
        return this.reset(), i.success ? (this.successes = Object.keys(e(a, !0)), !0) : (this.errors = s(i.error), !1);
      },
      validateOnly(i) {
        if (!o.shape || !(i in o.shape))
          return console.warn(`No validation schema defined for the field: ${i}`), !1;
        const c = { [i]: e(a, !0)[i] }, p = o.shape[i].safeParse(c[i]);
        return p.success ? (delete this.errors[i], this.successes.includes(i) || this.successes.push(i), !0) : (this.successes = this.successes.filter((k) => k !== i), this.errors[i] = p.error.format()._errors[0] ?? "", !1);
      }
    };
  };
  r.directive("zvalidate", (a, { expression: o }, { cleanup: i }) => {
    const c = e(a);
    if (t(c), c.zvalidate || (c.zvalidate = n(a)), o) {
      const u = (p) => {
        const k = p.target.getAttribute("x-model");
        k && c.zvalidate.validateOnly(k);
      };
      a.addEventListener(o, u), i(() => a.removeEventListener(o, u));
    }
  });
};
export {
  Lt as z
};
//# sourceMappingURL=zValidate-QONFmFav.js.map
