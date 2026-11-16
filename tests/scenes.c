#define GOOME_IMPLEMENTATION
#include "goome.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static uint32_t rf_fnv(const uint32_t *px, int w, int h, int stride)
{
    uint32_t v = 2166136261u;
    for (int y = 0; y < h; y++)
        for (int x = 0; x < w; x++) {
            uint32_t p = px[(size_t)y * stride + x];
            for (int k = 0; k < 4; k++) v = (v ^ ((p >> (k * 8)) & 255)) * 16777619u;
        }
    return v;
}

static unsigned char *rf_read(const char *dir, const char *name, size_t *n)
{
    char path[1024];
    snprintf(path, sizeof(path), "%s/%s", dir, name);
    FILE *f = fopen(path, "rb");
    if (!f) return NULL;
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    unsigned char *b = malloc(len > 0 ? (size_t)len : 1);
    *n = b && len > 0 ? fread(b, 1, (size_t)len, f) : 0;
    fclose(f);
    return b;
}

typedef struct {
    goome *g;
    goome_ui *u;
    int on, dropped;
    double box, sp, last;
    uint32_t col, hash;
} rf_am;

static void rf_am_frame(rf_am *k)
{
    goome_event ev;
    while (goome_poll(k->g, &ev, 0) > 0) goome_ui_feed(k->u, &ev);
    goome_canvas *c = goome_ui_begin(k->u, 0);
    if (!c) return;
    goome_canvas *r = goome_ui_canvas(k->u);
    k->box = goome_ui_anim(k->u, "box", k->on ? 200 : 10, 160, GOOME_EASE_OUT);
    k->sp = goome_ui_anim(k->u, "spring", k->on ? 1 : 0, 320, GOOME_EASE_SPRING);
    k->col = goome_ui_anim_color(k->u, "col", k->on ? 0xFF20D060u : 0x00000000u, 200, GOOME_EASE_LINEAR);
    if (!k->dropped) k->last = goome_ui_anim(k->u, "gone", k->on ? 5 : 0, 100, GOOME_EASE_LINEAR);
    if (r) {
        goome_draw_rect(r, k->box, 20, 60, 40, 0xFFE0A030u);
        goome_draw_rrect(r, 20 + k->sp * 180, 90, 50, 30, goome_radius(15), 0xFF4FB3F7u);
        goome_draw_rect(r, 20, 140, 260, 40, k->col);
    }
    goome_ui_end(k->u);
    k->hash = rf_fnv(c->px, c->w, c->h, c->stride);
}

static int ref_anim(uint32_t *out)
{
    int err;
    rf_am k;
    memset(&k, 0, sizeof(k));
    k.g = goome_open(&(goome_opts){.backend = GOOME_TEST, .mode = GOOME_MODE_WINDOW, .width = 300, .height = 200, .test_script = "end 100000"}, &err);
    if (!k.g) return -1;
    k.u = goome_ui_new(k.g);
    rf_am_frame(&k);
    rf_am_frame(&k);
    k.on = 1;
    for (int frames = 0; frames < 60; frames++) {
        rf_am_frame(&k);
        if (frames == 1) out[0] = k.hash;
        if (frames == 4) out[1] = k.hash;
        if (frames == 8) out[2] = k.hash;
    }
    out[3] = k.hash;
    int done = k.box == 200 && k.sp == 1 && k.col == 0xFF20D060u && k.last == 5;
    goome_ui_free(k.u);
    goome_close(k.g);
    return done;
}

static uint32_t rf_txt(goome_font *f, double size, const char *s, uint32_t argb, int dir, int w, int h)
{
    static uint32_t px[400 * 120];
    goome_canvas c;
    memset(&c, 0, sizeof(c));
    memset(px, 0, sizeof(px));
    c.px = px, c.w = w, c.h = h, c.stride = 400, c.scale = 1, c.kx1 = w, c.ky1 = h;
    goome_text_dir(dir);
    goome_text(&c, f, size, 4, 4, s, argb);
    goome_text_dir(GOOME_DIR_AUTO);
    return rf_fnv(px, 400, 120, 400);
}

static int ref_emoji(const unsigned char *colr, size_t ncolr, const unsigned char *cbdt, size_t ncbdt, const unsigned char *sbix, size_t nsbix,
              const unsigned char *sub, size_t nsub, uint32_t *out)
{
    goome_font *f = goome_font_load_mem(colr, ncolr, 0), *cb = goome_font_load_mem(cbdt, ncbdt, 0);
    goome_font *sb = goome_font_load_mem(sbix, nsbix, 0), *d = goome_font_load_mem(sub, nsub, 0);
    int ok = f && cb && sb && d;
    if (ok) {
        out[0] = rf_txt(f, 30, "ab \xF0\x9F\x98\x80 \xF0\x9F\x98\x80\xF0\x9F\x8F\xBB \xF0\x9F\x98\x80\xE2\x80\x8D\xF0\x9F\x98\x80 \xE2\x9D\xA4 \xE2\x9D\xA4\xEF\xB8\x8F", 0xFF2040A0, 0, 400, 60);
        static uint32_t px[400 * 120];
        goome_canvas c;
        memset(&c, 0, sizeof(c));
        memset(px, 0, sizeof(px));
        c.px = px, c.w = 400, c.h = 120, c.stride = 400, c.scale = 1;
        goome_text(&c, cb, 16, 4, 4, "\xF0\x9F\x90\xB1", 0xFFFFFFFF);
        goome_text(&c, cb, 64, 30, 4, "\xF0\x9F\x90\xB1", 0xFFFFFFFF);
        goome_text(&c, sb, 40, 120, 4, "\xF0\x9F\x90\xB1\xF0\x9F\x90\xB1", 0x80FFFFFF);
        out[1] = rf_fnv(px, 400, 120, 400);
        goome_font_fallback(d, f);
        out[2] = rf_txt(d, 20, "goome! \xF0\x9F\x98\x80 Hi", 0xFFFFFFFF, 0, 400, 40);
        out[3] = rf_txt(f, 24, "ab \xD7\x90\xD7\x91\xD7\x92 (12) c", 0xFFFFFFFF, 0, 400, 40);
        out[4] = rf_txt(f, 24, "ab \xD7\x90\xD7\x91\xD7\x92 (12) c", 0xFFFFFFFF, GOOME_DIR_RTL, 400, 40);
        out[5] = rf_txt(f, 30, "\xD8\xA8\xD9\x84\xD8\xA7\xD9\x85 \xD8\xA8\xD8\xA8\xD8\xA8 \xD9\x84\xD9\x85 \xD8\xA8\xD9\x8E\xD8\xA8", 0xFFFFFFFF, 0, 400, 50);
    }
    goome_font_free(d);
    goome_font_free(sb);
    goome_font_free(cb);
    goome_font_free(f);
    return ok;
}

typedef struct {
    goome *g;
    goome_ui *u;
    char in[64], ed[96];
    uint32_t hash;
} rf_im;

static void rf_im_frame(rf_im *k, int focus)
{
    goome_event ev;
    while (goome_poll(k->g, &ev, 0) > 0) goome_ui_feed(k->u, &ev);
    goome_canvas *c = goome_ui_begin(k->u, 0);
    if (!c) return;
    if (focus == 1) goome_ui_set_focus(k->u);
    goome_ui_input_ex(k->u, "in", k->in, sizeof(k->in), GOOME_INPUT_NO_SELECT_ON_FOCUS, NULL);
    if (focus == 2) goome_ui_set_focus(k->u);
    goome_ui_text_edit(k->u, "ed", k->ed, sizeof(k->ed), 80, 0);
    goome_ui_end(k->u);
    k->hash = rf_fnv(c->px, c->w, c->h, c->stride);
}

static int rf_im_open(rf_im *k, const char *in, const char *ed, int focus)
{
    int err;
    memset(k, 0, sizeof(*k));
    k->g = goome_open(&(goome_opts){.backend = GOOME_TEST, .mode = GOOME_MODE_WINDOW, .width = 300, .height = 200, .test_script = "end 100000"}, &err);
    if (!k->g) return 0;
    k->u = goome_ui_new(k->g);
    if (!k->u) return goome_close(k->g), 0;
    goome_theme *t = goome_ui_theme(k->u);
    t->font = NULL, t->font_size = 14, t->anim_ms = 0;
    goome_ui_cfg(k->u)->blink_ms = 0;
    snprintf(k->in, sizeof(k->in), "%s", in);
    snprintf(k->ed, sizeof(k->ed), "%s", ed);
    rf_im_frame(k, focus);
    rf_im_frame(k, 0);
    return 1;
}

static void rf_im_push(rf_im *k, int type, const char *s, int cur)
{
    goome_event e;
    memset(&e, 0, sizeof(e));
    e.type = type, e.id = cur;
    snprintf(e.msg, sizeof(e.msg), "%s", s);
    goome_push(k->g, &e);
    rf_im_frame(k, 0);
}

static int ref_ime(uint32_t *out, char *in, int cap)
{
    rf_im k;
    if (!rf_im_open(&k, "ab", "", 1)) return -1;
    out[0] = k.hash;
    rf_im_push(&k, GOOME_PREEDIT, "xyz", 1);
    out[1] = k.hash;
    rf_im_push(&k, GOOME_PREEDIT, "xyz", 3);
    out[2] = k.hash;
    rf_im_push(&k, GOOME_PREEDIT, "", 0);
    rf_im_push(&k, GOOME_TEXT, "\xE6\x97\xA5\xE6\x9C\xAC", 0);
    snprintf(in, (size_t)cap, "%s", k.in);
    goome_ui_free(k.u);
    goome_close(k.g);
    if (!rf_im_open(&k, "", "line", 2)) return -1;
    out[3] = k.hash;
    rf_im_push(&k, GOOME_PREEDIT, "kana", 2);
    out[4] = k.hash;
    goome_ui_free(k.u);
    goome_close(k.g);
    return 0;
}

int main(int argc, char **argv)
{
    const char *dir = argc > 1 ? argv[1] : "tests/data";
    uint32_t h[6];
    int done = ref_anim(h);
    printf("anim %08x %08x %08x %08x %d\n", h[0], h[1], h[2], h[3], done);
    size_t n[4];
    unsigned char *f[4] = {rf_read(dir, "colr.ttf", &n[0]), rf_read(dir, "cbdt.ttf", &n[1]), rf_read(dir, "sbix.ttf", &n[2]), rf_read(dir, "dejavu-sub.ttf", &n[3])};
    if (!f[0] || !f[1] || !f[2] || !f[3] || !ref_emoji(f[0], n[0], f[1], n[1], f[2], n[2], f[3], n[3], h)) return 1;
    printf("emoji %08x %08x %08x %08x %08x %08x\n", h[0], h[1], h[2], h[3], h[4], h[5]);
    for (int i = 0; i < 4; i++) free(f[i]);
    char in[64];
    if (ref_ime(h, in, sizeof(in)) < 0) return 1;
    printf("ime %08x %08x %08x %08x %08x %s\n", h[0], h[1], h[2], h[3], h[4], in);
    return 0;
}
