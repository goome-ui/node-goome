#ifndef NAPI_VERSION
#define NAPI_VERSION 8
#endif
#include <node_api.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "goome.h"

struct api_fn {
    const char *name;
    napi_callback fn;
};

static int is_kind(napi_env env, napi_value *a, size_t n, size_t i, napi_valuetype want)
{
    napi_valuetype t;
    if (i >= n || napi_typeof(env, a[i], &t) != napi_ok) return 0;
    return t == want;
}

static double arg_d(napi_env env, napi_value *a, size_t n, size_t i)
{
    double d = 0;
    bool b = false;
    if (is_kind(env, a, n, i, napi_number)) napi_get_value_double(env, a[i], &d);
    else if (is_kind(env, a, n, i, napi_boolean)) napi_get_value_bool(env, a[i], &b), d = b;
    return d;
}

static int arg_i(napi_env env, napi_value *a, size_t n, size_t i)
{
    double d = arg_d(env, a, n, i);
    if (d != d) return 0;
    if (d > 2147483647.0) return (int)(uint32_t)(int64_t)d;
    if (d < -2147483648.0) return 0;
    return (int)d;
}

static uint32_t arg_u(napi_env env, napi_value *a, size_t n, size_t i)
{
    double d = arg_d(env, a, n, i);
    if (d != d) return 0;
    return (uint32_t)(int64_t)d;
}

static void *arg_p(napi_env env, napi_value *a, size_t n, size_t i)
{
    bool yes = false;
    void *data = NULL;
    size_t len = 0;
    if (i >= n) return NULL;
    if (is_kind(env, a, n, i, napi_number)) return (void *)(uintptr_t)arg_d(env, a, n, i);
    if (is_kind(env, a, n, i, napi_bigint)) {
        uint64_t v = 0;
        bool lossless;
        napi_get_value_bigint_uint64(env, a[i], &v, &lossless);
        return (void *)(uintptr_t)v;
    }
    if (napi_is_typedarray(env, a[i], &yes) == napi_ok && yes) {
        napi_typedarray_type t;
        napi_get_typedarray_info(env, a[i], &t, &len, &data, NULL, NULL);
        return data;
    }
    if (napi_is_dataview(env, a[i], &yes) == napi_ok && yes) {
        napi_get_dataview_info(env, a[i], &len, &data, NULL, NULL);
        return data;
    }
    if (napi_is_arraybuffer(env, a[i], &yes) == napi_ok && yes) {
        napi_get_arraybuffer_info(env, a[i], &data, &len);
        return data;
    }
    return NULL;
}

static char *arg_s(napi_env env, napi_value *a, size_t n, size_t i)
{
    size_t len = 0;
    char *s;
    if (!is_kind(env, a, n, i, napi_string)) return NULL;
    napi_get_value_string_utf8(env, a[i], NULL, 0, &len);
    s = (char *)malloc(len + 1);
    if (!s) return NULL;
    napi_get_value_string_utf8(env, a[i], s, len + 1, &len);
    return s;
}

static char **arg_strs(napi_env env, napi_value *a, size_t n, size_t i)
{
    bool yes = false;
    uint32_t count = 0, k;
    size_t total = 0, len;
    char **out, *at;
    napi_value v;
    if (i >= n || napi_is_array(env, a[i], &yes) != napi_ok || !yes) return NULL;
    napi_get_array_length(env, a[i], &count);
    for (k = 0; k < count; k++) {
        len = 0;
        napi_get_element(env, a[i], k, &v);
        napi_get_value_string_utf8(env, v, NULL, 0, &len);
        total += len + 1;
    }
    out = (char **)malloc(sizeof(char *) * (count + 1) + total);
    if (!out) return NULL;
    at = (char *)(out + count + 1);
    for (k = 0; k < count; k++) {
        len = 0;
        napi_get_element(env, a[i], k, &v);
        if (napi_get_value_string_utf8(env, v, at, total, &len) != napi_ok) at[0] = 0, len = 0;
        out[k] = at;
        at += len + 1;
        total -= len + 1;
    }
    out[count] = NULL;
    return out;
}

static goome_radii arg_radii(napi_env env, napi_value *a, size_t n, size_t i)
{
    goome_radii r = {0, 0, 0, 0};
    bool yes = false;
    double v[4] = {0, 0, 0, 0};
    uint32_t k, count = 0;
    napi_value e;
    if (is_kind(env, a, n, i, napi_number)) {
        double d = arg_d(env, a, n, i);
        r.tl = r.tr = r.br = r.bl = d;
        return r;
    }
    if (i < n && napi_is_array(env, a[i], &yes) == napi_ok && yes) {
        napi_get_array_length(env, a[i], &count);
        for (k = 0; k < count && k < 4; k++) {
            napi_get_element(env, a[i], k, &e);
            napi_get_value_double(env, e, &v[k]);
        }
    } else if (i < n && napi_is_typedarray(env, a[i], &yes) == napi_ok && yes) {
        napi_typedarray_type t;
        size_t len = 0;
        void *data = NULL;
        napi_get_typedarray_info(env, a[i], &t, &len, &data, NULL, NULL);
        if (t == napi_float64_array)
            for (k = 0; k < len && k < 4; k++) v[k] = ((double *)data)[k];
    }
    r.tl = v[0], r.tr = v[1], r.br = v[2], r.bl = v[3];
    return r;
}

static napi_value ret_undef(napi_env env)
{
    napi_value v;
    napi_get_undefined(env, &v);
    return v;
}

static napi_value ret_d(napi_env env, double d)
{
    napi_value v;
    napi_create_double(env, d, &v);
    return v;
}

static napi_value ret_i(napi_env env, int i)
{
    napi_value v;
    napi_create_int32(env, i, &v);
    return v;
}

static napi_value ret_u(napi_env env, uint32_t u)
{
    napi_value v;
    napi_create_uint32(env, u, &v);
    return v;
}

static napi_value ret_l(napi_env env, long l)
{
    return ret_d(env, (double)l);
}

static napi_value ret_p(napi_env env, const void *p)
{
    napi_value v;
    if (!p) {
        napi_get_null(env, &v);
        return v;
    }
    return ret_d(env, (double)(uintptr_t)p);
}

static napi_value ret_s(napi_env env, const char *s)
{
    napi_value v;
    if (!s) {
        napi_get_null(env, &v);
        return v;
    }
    napi_create_string_utf8(env, s, NAPI_AUTO_LENGTH, &v);
    return v;
}

static napi_value ret_radii(napi_env env, goome_radii r)
{
    napi_value arr, e;
    double v[4];
    uint32_t k;
    v[0] = r.tl, v[1] = r.tr, v[2] = r.br, v[3] = r.bl;
    napi_create_array_with_length(env, 4, &arr);
    for (k = 0; k < 4; k++) {
        napi_create_double(env, v[k], &e);
        napi_set_element(env, arr, k, e);
    }
    return arr;
}

#include "api.c"

#define ARGS(k)                 \
    napi_value a[k];            \
    size_t n = k;               \
    napi_get_cb_info(env, info, &n, a, NULL, NULL)

static napi_value m_view(napi_env env, napi_callback_info info)
{
    ARGS(2);
    void *p = arg_p(env, a, n, 0);
    size_t len = (size_t)arg_d(env, a, n, 1);
    napi_value v;
    if (!p || !len || napi_create_external_arraybuffer(env, p, len, NULL, NULL, &v) != napi_ok) {
        napi_value e;
        bool pending = false;
        napi_is_exception_pending(env, &pending);
        if (pending) napi_get_and_clear_last_exception(env, &e);
        napi_get_null(env, &v);
    }
    return v;
}

static napi_value m_copy(napi_env env, napi_callback_info info)
{
    ARGS(2);
    void *p = arg_p(env, a, n, 0), *data = NULL;
    size_t len = (size_t)arg_d(env, a, n, 1);
    napi_value v;
    napi_create_arraybuffer(env, len, &data, &v);
    if (p && len && data) memcpy(data, p, len);
    return v;
}

static napi_value m_peek(napi_env env, napi_callback_info info)
{
    ARGS(3);
    char *p = (char *)arg_p(env, a, n, 0);
    int k = arg_i(env, a, n, 2);
    if (!p) return ret_undef(env);
    p += (size_t)arg_d(env, a, n, 1);
    switch (k) {
    case 0: { int32_t v; memcpy(&v, p, 4); return ret_d(env, v); }
    case 1: { uint32_t v; memcpy(&v, p, 4); return ret_d(env, v); }
    case 2: { double v; memcpy(&v, p, 8); return ret_d(env, v); }
    case 3: { void *v; memcpy(&v, p, sizeof(v)); return ret_p(env, v); }
    case 4: return ret_s(env, p);
    case 5: { long v; memcpy(&v, p, sizeof(v)); return ret_d(env, (double)v); }
    case 6: { float v; memcpy(&v, p, 4); return ret_d(env, v); }
    case 7: return ret_d(env, *(unsigned char *)p);
    case 8: { void *v; memcpy(&v, p, sizeof(v)); return ret_s(env, (const char *)v); }
    }
    return ret_undef(env);
}

static napi_value m_poke(napi_env env, napi_callback_info info)
{
    ARGS(5);
    char *p = (char *)arg_p(env, a, n, 0);
    int k = arg_i(env, a, n, 2);
    if (!p) return ret_undef(env);
    p += (size_t)arg_d(env, a, n, 1);
    switch (k) {
    case 0: { int32_t v = arg_i(env, a, n, 3); memcpy(p, &v, 4); break; }
    case 1: { uint32_t v = arg_u(env, a, n, 3); memcpy(p, &v, 4); break; }
    case 2: { double v = arg_d(env, a, n, 3); memcpy(p, &v, 8); break; }
    case 3: { void *v = arg_p(env, a, n, 3); memcpy(p, &v, sizeof(v)); break; }
    case 4: {
        int cap = arg_i(env, a, n, 4);
        char *s = arg_s(env, a, n, 3);
        if (cap > 0) {
            size_t len = s ? strlen(s) : 0;
            if (len > (size_t)cap - 1) len = (size_t)cap - 1;
            if (len) memcpy(p, s, len);
            p[len] = 0;
        }
        free(s);
        break;
    }
    case 5: { long v = (long)arg_d(env, a, n, 3); memcpy(p, &v, sizeof(v)); break; }
    case 6: { float v = (float)arg_d(env, a, n, 3); memcpy(p, &v, 4); break; }
    case 7: *(unsigned char *)p = (unsigned char)arg_i(env, a, n, 3); break;
    }
    return ret_undef(env);
}

static napi_value m_alloc(napi_env env, napi_callback_info info)
{
    ARGS(1);
    size_t len = (size_t)arg_d(env, a, n, 0);
    return ret_p(env, calloc(1, len ? len : 1));
}

static napi_value m_free(napi_env env, napi_callback_info info)
{
    ARGS(1);
    free(arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value m_cstr(napi_env env, napi_callback_info info)
{
    ARGS(1);
    return ret_p(env, arg_s(env, a, n, 0));
}

static napi_value m_addr(napi_env env, napi_callback_info info)
{
    ARGS(1);
    return ret_p(env, arg_p(env, a, n, 0));
}

static napi_value m_write(napi_env env, napi_callback_info info)
{
    ARGS(3);
    void *dst = arg_p(env, a, n, 0), *src = arg_p(env, a, n, 1);
    size_t len = (size_t)arg_d(env, a, n, 2);
    if (dst && src && len) memmove(dst, src, len);
    return ret_undef(env);
}

struct ease_js {
    napi_env env;
    napi_ref fn;
};

static double js_ease(double t, void *user)
{
    struct ease_js *e = (struct ease_js *)user;
    napi_value f, global, arg, out;
    double v = t;
    if (napi_get_reference_value(e->env, e->fn, &f) != napi_ok || !f) return t;
    napi_get_global(e->env, &global);
    napi_create_double(e->env, t, &arg);
    if (napi_call_function(e->env, global, f, 1, &arg, &out) != napi_ok) {
        napi_value err;
        bool pending = false;
        napi_is_exception_pending(e->env, &pending);
        if (pending) napi_get_and_clear_last_exception(e->env, &err);
        return t;
    }
    if (napi_get_value_double(e->env, out, &v) != napi_ok) return t;
    return v;
}

static napi_value m_ease(napi_env env, napi_callback_info info)
{
    ARGS(2);
    goome_ui_config *c = (goome_ui_config *)arg_p(env, a, n, 0);
    if (!c) return ret_undef(env);
    if (c->ease == js_ease && c->ease_user) {
        struct ease_js *old = (struct ease_js *)c->ease_user;
        napi_delete_reference(env, old->fn);
        free(old);
    }
    c->ease = NULL;
    c->ease_user = NULL;
    if (is_kind(env, a, n, 1, napi_function)) {
        struct ease_js *e = (struct ease_js *)malloc(sizeof(*e));
        if (!e) return ret_undef(env);
        e->env = env;
        napi_create_reference(env, a[1], 1, &e->fn);
        c->ease = js_ease;
        c->ease_user = e;
    }
    return ret_undef(env);
}

static napi_value init(napi_env env, napi_value exports)
{
    size_t i, count = sizeof(api_fns) / sizeof(api_fns[0]);
    napi_value fns, f;
    static const struct api_fn extra[] = {
        {"view", m_view}, {"copy", m_copy}, {"peek", m_peek}, {"poke", m_poke},
        {"alloc", m_alloc}, {"free", m_free}, {"cstr", m_cstr}, {"addr", m_addr}, {"write", m_write}, {"ease", m_ease},
    };
    napi_create_object(env, &fns);
    for (i = 0; i < count; i++) {
        napi_create_function(env, api_fns[i].name, NAPI_AUTO_LENGTH, api_fns[i].fn, NULL, &f);
        napi_set_named_property(env, fns, api_fns[i].name, f);
    }
    napi_set_named_property(env, exports, "fn", fns);
    for (i = 0; i < sizeof(extra) / sizeof(extra[0]); i++) {
        napi_create_function(env, extra[i].name, NAPI_AUTO_LENGTH, extra[i].fn, NULL, &f);
        napi_set_named_property(env, exports, extra[i].name, f);
    }
    napi_set_named_property(env, exports, "ptrSize", ret_i(env, (int)sizeof(void *)));
    napi_set_named_property(env, exports, "longSize", ret_i(env, (int)sizeof(long)));
    napi_set_named_property(env, exports, "version", ret_s(env, GOOME_VERSION));
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
