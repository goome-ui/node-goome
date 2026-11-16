static napi_value w_goome_open(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_open((const goome_opts *)arg_p(env, a, n, 0), (int *)arg_p(env, a, n, 1));
    return ret_p(env, r);
}

static napi_value w_goome_open_app(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    void * r = (void *)goome_open_app(a0, arg_i(env, a, n, 1), arg_i(env, a, n, 2), (int *)arg_p(env, a, n, 3));
    free(a0);
    return ret_p(env, r);
}

static napi_value w_goome_close(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_close((goome *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_error(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_error((goome *)arg_p(env, a, n, 0));
    return ret_s(env, r);
}

static napi_value w_goome_strerror(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_strerror(arg_i(env, a, n, 0));
    return ret_s(env, r);
}

static napi_value w_goome_backend_name(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_backend_name((goome *)arg_p(env, a, n, 0));
    return ret_s(env, r);
}

static napi_value w_goome_caps(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_caps((goome *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_monitors(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_monitors((goome *)arg_p(env, a, n, 0), (goome_monitor *)arg_p(env, a, n, 1), arg_i(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_capture(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_capture((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), (const goome_rect *)arg_p(env, a, n, 2), (goome_image *)arg_p(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_alpha_at(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_alpha_at((goome *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_begin(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_begin((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_p(env, r);
}

static napi_value w_goome_end(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_end((goome *)arg_p(env, a, n, 0), (goome_canvas *)arg_p(env, a, n, 1), (const goome_rect *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_damage(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_damage((goome_canvas *)arg_p(env, a, n, 0), (const goome_rect *)arg_p(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_poll(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_poll((goome *)arg_p(env, a, n, 0), (goome_event *)arg_p(env, a, n, 1), arg_i(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_pointer(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_pointer((goome *)arg_p(env, a, n, 0), (double *)arg_p(env, a, n, 1), (double *)arg_p(env, a, n, 2), (int *)arg_p(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_keyboard(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_keyboard((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_grab(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_grab((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_grabbed(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_grabbed((goome *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_hotkey(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_hotkey((goome *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_parse_combo(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    int r = goome_parse_combo(a0, (int *)arg_p(env, a, n, 1), (int *)arg_p(env, a, n, 2));
    free(a0);
    return ret_i(env, r);
}

static napi_value w_goome_control_path(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_control_path((goome *)arg_p(env, a, n, 0));
    return ret_s(env, r);
}

static napi_value w_goome_send(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_send(a0, a1);
    free(a0);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_pace(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_pace((goome_pacer *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_now_ms(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    long r = goome_now_ms();
    return ret_l(env, r);
}

static napi_value w_goome_mode(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_mode((goome *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_window_title(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_window_title((goome *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_window_size(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_size((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_i(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_window_pos(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_pos((goome *)arg_p(env, a, n, 0), (int *)arg_p(env, a, n, 1), (int *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_window_state(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_state((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_window_get_state(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_get_state((goome *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_window_drag(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_drag((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_window_show(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_window_show((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_cursor(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_cursor((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_cursor_shape(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_cursor_shape((goome *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_clipboard_set(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_clipboard_set((goome *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_clipboard_get(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_clipboard_get((goome *)arg_p(env, a, n, 0), (char *)arg_p(env, a, n, 1), arg_i(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_drop_path(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_drop_path((goome *)arg_p(env, a, n, 0));
    return ret_s(env, r);
}

static napi_value w_goome_push(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_push((goome *)arg_p(env, a, n, 0), (const goome_event *)arg_p(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_resize(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_resize((goome *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_i(env, a, n, 2), arg_d(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_frame(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_frame((goome *)arg_p(env, a, n, 0), (goome_image *)arg_p(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_hit(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_hit((goome *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_frame_dirty(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_frame_dirty((goome *)arg_p(env, a, n, 0), (goome_rect *)arg_p(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_frame_copy(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_frame_copy((goome *)arg_p(env, a, n, 0), (void *)arg_p(env, a, n, 1), arg_i(env, a, n, 2), arg_i(env, a, n, 3), (const goome_rect *)arg_p(env, a, n, 4));
    return ret_i(env, r);
}

static napi_value w_goome_save_ppm(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    int r = goome_save_ppm(a0, (const uint32_t *)arg_p(env, a, n, 1), arg_i(env, a, n, 2), arg_i(env, a, n, 3), arg_i(env, a, n, 4));
    free(a0);
    return ret_i(env, r);
}

static napi_value w_goome_clear(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_clear((goome_canvas *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_draw_rect(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_rect((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_u(env, a, n, 5));
    return ret_undef(env);
}

static napi_value w_goome_draw_round_rect(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_round_rect((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_u(env, a, n, 6));
    return ret_undef(env);
}

static napi_value w_goome_draw_frame(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_frame((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_u(env, a, n, 6));
    return ret_undef(env);
}

static napi_value w_goome_draw_line(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_line((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_u(env, a, n, 6));
    return ret_undef(env);
}

static napi_value w_goome_draw_triangle(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_triangle((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6), arg_u(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_draw_image(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_image((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), (const uint32_t *)arg_p(env, a, n, 5), arg_i(env, a, n, 6), arg_i(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_erase(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_erase((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_draw_text(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a3 = arg_s(env, a, n, 3);
    double r = goome_draw_text((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), a3, arg_i(env, a, n, 4), arg_u(env, a, n, 5));
    free(a3);
    return ret_d(env, r);
}

static napi_value w_goome_text_width(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    double r = goome_text_width((const goome_canvas *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_d(env, r);
}

static napi_value w_goome_set_font(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_set_font(arg_i(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_font_count(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_font_count();
    return ret_i(env, r);
}

static napi_value w_goome_canvas_blit(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_canvas_blit((goome_canvas *)arg_p(env, a, n, 0), (const goome_canvas *)arg_p(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_radius(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_radii r = goome_radius(arg_d(env, a, n, 0));
    return ret_radii(env, r);
}

static napi_value w_goome_clip_push(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_clip_push((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_clip_pop(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_clip_pop((goome_canvas *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_draw_rrect(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_rrect((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_radii(env, a, n, 5), arg_u(env, a, n, 6));
    return ret_undef(env);
}

static napi_value w_goome_draw_rrect_line(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_rrect_line((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_radii(env, a, n, 5), arg_d(env, a, n, 6), arg_u(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_draw_rrect_grad(napi_env env, napi_callback_info info)
{
    napi_value a[9];
    size_t n = 9;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_rrect_grad((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_radii(env, a, n, 5), arg_u(env, a, n, 6), arg_u(env, a, n, 7), arg_i(env, a, n, 8));
    return ret_undef(env);
}

static napi_value w_goome_draw_shadow(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_shadow((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6), arg_u(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_draw_circle(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_circle((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_u(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_draw_ring(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_ring((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_u(env, a, n, 5));
    return ret_undef(env);
}

static napi_value w_goome_draw_arc(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_arc((goome_canvas *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6), arg_u(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_draw_poly(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_poly((goome_canvas *)arg_p(env, a, n, 0), (const double *)arg_p(env, a, n, 1), arg_i(env, a, n, 2), arg_u(env, a, n, 3));
    return ret_undef(env);
}

static napi_value w_goome_bitmap_load(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    int r = goome_bitmap_load(a0, (goome_bitmap *)arg_p(env, a, n, 1));
    free(a0);
    return ret_i(env, r);
}

static napi_value w_goome_bitmap_load_mem(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_bitmap_load_mem((const void *)arg_p(env, a, n, 0), (size_t)arg_d(env, a, n, 1), (goome_bitmap *)arg_p(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_bitmap_error(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    const char * r = goome_bitmap_error();
    return ret_s(env, r);
}

static napi_value w_goome_bitmap_from_argb(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_bitmap_from_argb((const uint32_t *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_i(env, a, n, 2), (goome_bitmap *)arg_p(env, a, n, 3));
    return ret_i(env, r);
}

static napi_value w_goome_bitmap_free(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_bitmap_free((goome_bitmap *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_draw_bitmap(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_bitmap((goome_canvas *)arg_p(env, a, n, 0), (const goome_bitmap *)arg_p(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_radii(env, a, n, 6), arg_u(env, a, n, 7));
    return ret_undef(env);
}

static napi_value w_goome_draw_bitmap_part(napi_env env, napi_callback_info info)
{
    napi_value a[11];
    size_t n = 11;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_bitmap_part((goome_canvas *)arg_p(env, a, n, 0), (const goome_bitmap *)arg_p(env, a, n, 1), arg_i(env, a, n, 2), arg_i(env, a, n, 3), arg_i(env, a, n, 4), arg_i(env, a, n, 5), arg_d(env, a, n, 6), arg_d(env, a, n, 7), arg_d(env, a, n, 8), arg_d(env, a, n, 9), arg_u(env, a, n, 10));
    return ret_undef(env);
}

static napi_value w_goome_draw_bitmap_nine(napi_env env, napi_callback_info info)
{
    napi_value a[10];
    size_t n = 10;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_draw_bitmap_nine((goome_canvas *)arg_p(env, a, n, 0), (const goome_bitmap *)arg_p(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6), arg_d(env, a, n, 7), arg_d(env, a, n, 8), arg_d(env, a, n, 9));
    return ret_undef(env);
}

static napi_value w_goome_font_load(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    void * r = (void *)goome_font_load(a0);
    free(a0);
    return ret_p(env, r);
}

static napi_value w_goome_font_load_index(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    void * r = (void *)goome_font_load_index(a0, arg_i(env, a, n, 1));
    free(a0);
    return ret_p(env, r);
}

static napi_value w_goome_font_load_mem(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_font_load_mem((const void *)arg_p(env, a, n, 0), (size_t)arg_d(env, a, n, 1), arg_i(env, a, n, 2));
    return ret_p(env, r);
}

static napi_value w_goome_font_system(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a0 = arg_s(env, a, n, 0);
    void * r = (void *)goome_font_system(a0);
    free(a0);
    return ret_p(env, r);
}

static napi_value w_goome_font_free(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_font_free((goome_font *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_text(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a5 = arg_s(env, a, n, 5);
    double r = goome_text((goome_canvas *)arg_p(env, a, n, 0), (goome_font *)arg_p(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), a5, arg_u(env, a, n, 6));
    free(a5);
    return ret_d(env, r);
}

static napi_value w_goome_text_measure(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a2 = arg_s(env, a, n, 2);
    double r = goome_text_measure((goome_font *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), a2, (double *)arg_p(env, a, n, 3));
    free(a2);
    return ret_d(env, r);
}

static napi_value w_goome_text_line_height(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    double r = goome_text_line_height((goome_font *)arg_p(env, a, n, 0), arg_d(env, a, n, 1));
    return ret_d(env, r);
}

static napi_value w_goome_ui_new(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_ui_new((goome *)arg_p(env, a, n, 0));
    return ret_p(env, r);
}

static napi_value w_goome_ui_free(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_free((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_theme(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_ui_theme((goome_ui *)arg_p(env, a, n, 0));
    return ret_p(env, r);
}

static napi_value w_goome_ui_theme_dark(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_theme_dark((goome_theme *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_theme_light(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_theme_light((goome_theme *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_feed(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_feed((goome_ui *)arg_p(env, a, n, 0), (const goome_event *)arg_p(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_ui_begin(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_ui_begin((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_p(env, r);
}

static napi_value w_goome_ui_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_hit(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_hit((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_ui_animating(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_animating((goome_ui *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_ui_wants(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_wants((goome_ui *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_ui_auto_grab(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_auto_grab((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_window(napi_env env, napi_callback_info info)
{
    napi_value a[8];
    size_t n = 8;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_window((goome_ui *)arg_p(env, a, n, 0), a1, (double *)arg_p(env, a, n, 2), (double *)arg_p(env, a, n, 3), (double *)arg_p(env, a, n, 4), (double *)arg_p(env, a, n, 5), arg_i(env, a, n, 6), (int *)arg_p(env, a, n, 7));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_window_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_window_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_row(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_row((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_same_line(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_same_line((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_space(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_space((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_separator(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_separator((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_width(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_width((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_label(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_label((goome_ui *)arg_p(env, a, n, 0), "%s", a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_heading(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_heading((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_wrapped(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_wrapped((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_button(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_button((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_image_button(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_image_button((goome_ui *)arg_p(env, a, n, 0), a1, (const goome_bitmap *)arg_p(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_image(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_image((goome_ui *)arg_p(env, a, n, 0), (const goome_bitmap *)arg_p(env, a, n, 1), arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4));
    return ret_undef(env);
}

static napi_value w_goome_ui_checkbox(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_checkbox((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_toggle(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_toggle((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_radio(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_radio((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_slider(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char *a5 = arg_s(env, a, n, 5);
    int r = goome_ui_slider((goome_ui *)arg_p(env, a, n, 0), a1, (double *)arg_p(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), a5);
    free(a1);
    free(a5);
    return ret_i(env, r);
}

static napi_value w_goome_ui_slider_int(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_slider_int((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2), arg_i(env, a, n, 3), arg_i(env, a, n, 4));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_input(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_input((goome_ui *)arg_p(env, a, n, 0), a1, (char *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_input_ex(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char *a5 = arg_s(env, a, n, 5);
    int r = goome_ui_input_ex((goome_ui *)arg_p(env, a, n, 0), a1, (char *)arg_p(env, a, n, 2), arg_i(env, a, n, 3), arg_i(env, a, n, 4), a5);
    free(a1);
    free(a5);
    return ret_i(env, r);
}

static napi_value w_goome_ui_combo(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char **a3 = arg_strs(env, a, n, 3);
    int r = goome_ui_combo((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2), (const char *const *)a3, arg_i(env, a, n, 4));
    free(a1);
    free(a3);
    return ret_i(env, r);
}

static napi_value w_goome_ui_selectable(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_selectable((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_tabs(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char **a2 = arg_strs(env, a, n, 2);
    int r = goome_ui_tabs((goome_ui *)arg_p(env, a, n, 0), a1, (const char *const *)a2, arg_i(env, a, n, 3), (int *)arg_p(env, a, n, 4));
    free(a1);
    free(a2);
    return ret_i(env, r);
}

static napi_value w_goome_ui_collapsing(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_collapsing((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_progress(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a2 = arg_s(env, a, n, 2);
    goome_ui_progress((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), a2);
    free(a2);
    return ret_undef(env);
}

static napi_value w_goome_ui_color(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_color((goome_ui *)arg_p(env, a, n, 0), a1, (uint32_t *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_tooltip(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_tooltip((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_hovered(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_hovered((goome_ui *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_ui_scroll_begin(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_scroll_begin((goome_ui *)arg_p(env, a, n, 0), a1, arg_d(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_scroll_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_scroll_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_id(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_push_id((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_pop_id(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_pop_id((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_app(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_app((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_app_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_app_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_menubar_begin(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_menubar_begin((goome_ui *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_ui_menubar_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_menubar_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_menu_begin(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_menu_begin((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_menu_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_menu_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_menu_item(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char *a2 = arg_s(env, a, n, 2);
    int r = goome_ui_menu_item((goome_ui *)arg_p(env, a, n, 0), a1, a2, (int *)arg_p(env, a, n, 3));
    free(a1);
    free(a2);
    return ret_i(env, r);
}

static napi_value w_goome_ui_menu_separator(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_menu_separator((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_context_begin(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_context_begin((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_context_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_context_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_popup_open(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_popup_open((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_popup_begin(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_popup_begin((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_popup_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_popup_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_popup_close(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_popup_close((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_modal_begin(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_modal_begin((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_modal_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_modal_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_toast(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_toast((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_statusbar(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_statusbar((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_focused(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_focused((goome_ui *)arg_p(env, a, n, 0));
    return ret_i(env, r);
}

static napi_value w_goome_ui_set_focus(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_set_focus((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_text_edit(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_text_edit((goome_ui *)arg_p(env, a, n, 0), a1, (char *)arg_p(env, a, n, 2), arg_i(env, a, n, 3), arg_d(env, a, n, 4), arg_i(env, a, n, 5));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_table_begin(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_table_begin((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2), arg_d(env, a, n, 3), arg_i(env, a, n, 4));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_table_column(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_table_column((goome_ui *)arg_p(env, a, n, 0), a1, arg_d(env, a, n, 2));
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_table_sort(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_table_sort((goome_ui *)arg_p(env, a, n, 0), (int *)arg_p(env, a, n, 1), (int *)arg_p(env, a, n, 2));
    return ret_i(env, r);
}

static napi_value w_goome_ui_table_row(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_table_row((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_table_next(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_table_next((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_table_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_table_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_tree(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_tree((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_tree_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_tree_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_list_clip(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_list_clip((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_d(env, a, n, 2), (int *)arg_p(env, a, n, 3), (int *)arg_p(env, a, n, 4));
    return ret_i(env, r);
}

static napi_value w_goome_ui_drag_float(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char *a6 = arg_s(env, a, n, 6);
    int r = goome_ui_drag_float((goome_ui *)arg_p(env, a, n, 0), a1, (double *)arg_p(env, a, n, 2), arg_d(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), a6);
    free(a1);
    free(a6);
    return ret_i(env, r);
}

static napi_value w_goome_ui_drag_int(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_drag_int((goome_ui *)arg_p(env, a, n, 0), a1, (int *)arg_p(env, a, n, 2), arg_d(env, a, n, 3), arg_i(env, a, n, 4), arg_i(env, a, n, 5));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_number(napi_env env, napi_callback_info info)
{
    napi_value a[5];
    size_t n = 5;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    char *a4 = arg_s(env, a, n, 4);
    int r = goome_ui_number((goome_ui *)arg_p(env, a, n, 0), a1, (double *)arg_p(env, a, n, 2), arg_d(env, a, n, 3), a4);
    free(a1);
    free(a4);
    return ret_i(env, r);
}

static napi_value w_goome_ui_plot_lines(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_plot_lines((goome_ui *)arg_p(env, a, n, 0), a1, (const float *)arg_p(env, a, n, 2), arg_i(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6));
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_plot_bars(napi_env env, napi_callback_info info)
{
    napi_value a[7];
    size_t n = 7;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_plot_bars((goome_ui *)arg_p(env, a, n, 0), a1, (const float *)arg_p(env, a, n, 2), arg_i(env, a, n, 3), arg_d(env, a, n, 4), arg_d(env, a, n, 5), arg_d(env, a, n, 6));
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_split_begin(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_split_begin((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2), (double *)arg_p(env, a, n, 3));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_split_next(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_split_next((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_split_end(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_split_end((goome_ui *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_drag_source(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_drag_source((goome_ui *)arg_p(env, a, n, 0), a1, (const void *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_drop_target(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_drop_target((goome_ui *)arg_p(env, a, n, 0), a1, (void *)arg_p(env, a, n, 2), arg_i(env, a, n, 3));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_spinner(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_spinner((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_link(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_link((goome_ui *)arg_p(env, a, n, 0), a1);
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_badge(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    goome_ui_badge((goome_ui *)arg_p(env, a, n, 0), a1, arg_u(env, a, n, 2));
    free(a1);
    return ret_undef(env);
}

static napi_value w_goome_ui_pos(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_pos((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_size(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_size((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1), arg_d(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_color(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_color((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_u(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_num(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_num((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), arg_d(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_radii(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_radii((goome_ui *)arg_p(env, a, n, 0), arg_radii(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_font(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_font((goome_ui *)arg_p(env, a, n, 0), (goome_font *)arg_p(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_skin(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_skin((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), (const goome_skin *)arg_p(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_theme(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_theme((goome_ui *)arg_p(env, a, n, 0), (const goome_theme *)arg_p(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_push_icon(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_push_icon((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), (const goome_bitmap *)arg_p(env, a, n, 2));
    return ret_undef(env);
}

static napi_value w_goome_ui_pop(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_pop((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_custom(napi_env env, napi_callback_info info)
{
    napi_value a[6];
    size_t n = 6;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    int r = goome_ui_custom((goome_ui *)arg_p(env, a, n, 0), a1, arg_d(env, a, n, 2), arg_d(env, a, n, 3), arg_i(env, a, n, 4), (goome_ui_item *)arg_p(env, a, n, 5));
    free(a1);
    return ret_i(env, r);
}

static napi_value w_goome_ui_canvas(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_ui_canvas((goome_ui *)arg_p(env, a, n, 0));
    return ret_p(env, r);
}

static napi_value w_goome_ui_store(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a1 = arg_s(env, a, n, 1);
    void * r = (void *)goome_ui_store((goome_ui *)arg_p(env, a, n, 0), a1, arg_i(env, a, n, 2));
    free(a1);
    return ret_p(env, r);
}

static napi_value w_goome_ui_theme_make(napi_env env, napi_callback_info info)
{
    napi_value a[4];
    size_t n = 4;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_theme_make((goome_theme *)arg_p(env, a, n, 0), arg_u(env, a, n, 1), arg_i(env, a, n, 2), arg_d(env, a, n, 3));
    return ret_undef(env);
}

static napi_value w_goome_ui_theme_preset(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    int r = goome_ui_theme_preset((goome_theme *)arg_p(env, a, n, 0), arg_i(env, a, n, 1));
    return ret_i(env, r);
}

static napi_value w_goome_ui_scale(napi_env env, napi_callback_info info)
{
    napi_value a[2];
    size_t n = 2;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_scale((goome_ui *)arg_p(env, a, n, 0), arg_d(env, a, n, 1));
    return ret_undef(env);
}

static napi_value w_goome_ui_cfg(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    void * r = (void *)goome_ui_cfg((goome_ui *)arg_p(env, a, n, 0));
    return ret_p(env, r);
}

static napi_value w_goome_ui_config_default(napi_env env, napi_callback_info info)
{
    napi_value a[1];
    size_t n = 1;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    goome_ui_config_default((goome_ui_config *)arg_p(env, a, n, 0));
    return ret_undef(env);
}

static napi_value w_goome_ui_bind(napi_env env, napi_callback_info info)
{
    napi_value a[3];
    size_t n = 3;
    napi_get_cb_info(env, info, &n, a, NULL, NULL);
    char *a2 = arg_s(env, a, n, 2);
    int r = goome_ui_bind((goome_ui *)arg_p(env, a, n, 0), arg_i(env, a, n, 1), a2);
    free(a2);
    return ret_i(env, r);
}

static const struct api_fn api_fns[] = {
    {"open", w_goome_open},
    {"open_app", w_goome_open_app},
    {"close", w_goome_close},
    {"error", w_goome_error},
    {"strerror", w_goome_strerror},
    {"backend_name", w_goome_backend_name},
    {"caps", w_goome_caps},
    {"monitors", w_goome_monitors},
    {"capture", w_goome_capture},
    {"alpha_at", w_goome_alpha_at},
    {"begin", w_goome_begin},
    {"end", w_goome_end},
    {"damage", w_goome_damage},
    {"poll", w_goome_poll},
    {"pointer", w_goome_pointer},
    {"keyboard", w_goome_keyboard},
    {"grab", w_goome_grab},
    {"grabbed", w_goome_grabbed},
    {"hotkey", w_goome_hotkey},
    {"parse_combo", w_goome_parse_combo},
    {"control_path", w_goome_control_path},
    {"send", w_goome_send},
    {"pace", w_goome_pace},
    {"now_ms", w_goome_now_ms},
    {"mode", w_goome_mode},
    {"window_title", w_goome_window_title},
    {"window_size", w_goome_window_size},
    {"window_pos", w_goome_window_pos},
    {"window_state", w_goome_window_state},
    {"window_get_state", w_goome_window_get_state},
    {"window_drag", w_goome_window_drag},
    {"window_show", w_goome_window_show},
    {"cursor", w_goome_cursor},
    {"cursor_shape", w_goome_cursor_shape},
    {"clipboard_set", w_goome_clipboard_set},
    {"clipboard_get", w_goome_clipboard_get},
    {"drop_path", w_goome_drop_path},
    {"push", w_goome_push},
    {"resize", w_goome_resize},
    {"frame", w_goome_frame},
    {"hit", w_goome_hit},
    {"frame_dirty", w_goome_frame_dirty},
    {"frame_copy", w_goome_frame_copy},
    {"save_ppm", w_goome_save_ppm},
    {"clear", w_goome_clear},
    {"draw_rect", w_goome_draw_rect},
    {"draw_round_rect", w_goome_draw_round_rect},
    {"draw_frame", w_goome_draw_frame},
    {"draw_line", w_goome_draw_line},
    {"draw_triangle", w_goome_draw_triangle},
    {"draw_image", w_goome_draw_image},
    {"erase", w_goome_erase},
    {"draw_text", w_goome_draw_text},
    {"text_width", w_goome_text_width},
    {"set_font", w_goome_set_font},
    {"font_count", w_goome_font_count},
    {"canvas_blit", w_goome_canvas_blit},
    {"radius", w_goome_radius},
    {"clip_push", w_goome_clip_push},
    {"clip_pop", w_goome_clip_pop},
    {"draw_rrect", w_goome_draw_rrect},
    {"draw_rrect_line", w_goome_draw_rrect_line},
    {"draw_rrect_grad", w_goome_draw_rrect_grad},
    {"draw_shadow", w_goome_draw_shadow},
    {"draw_circle", w_goome_draw_circle},
    {"draw_ring", w_goome_draw_ring},
    {"draw_arc", w_goome_draw_arc},
    {"draw_poly", w_goome_draw_poly},
    {"bitmap_load", w_goome_bitmap_load},
    {"bitmap_load_mem", w_goome_bitmap_load_mem},
    {"bitmap_error", w_goome_bitmap_error},
    {"bitmap_from_argb", w_goome_bitmap_from_argb},
    {"bitmap_free", w_goome_bitmap_free},
    {"draw_bitmap", w_goome_draw_bitmap},
    {"draw_bitmap_part", w_goome_draw_bitmap_part},
    {"draw_bitmap_nine", w_goome_draw_bitmap_nine},
    {"font_load", w_goome_font_load},
    {"font_load_index", w_goome_font_load_index},
    {"font_load_mem", w_goome_font_load_mem},
    {"font_system", w_goome_font_system},
    {"font_free", w_goome_font_free},
    {"text", w_goome_text},
    {"text_measure", w_goome_text_measure},
    {"text_line_height", w_goome_text_line_height},
    {"ui_new", w_goome_ui_new},
    {"ui_free", w_goome_ui_free},
    {"ui_theme", w_goome_ui_theme},
    {"ui_theme_dark", w_goome_ui_theme_dark},
    {"ui_theme_light", w_goome_ui_theme_light},
    {"ui_feed", w_goome_ui_feed},
    {"ui_begin", w_goome_ui_begin},
    {"ui_end", w_goome_ui_end},
    {"ui_hit", w_goome_ui_hit},
    {"ui_animating", w_goome_ui_animating},
    {"ui_wants", w_goome_ui_wants},
    {"ui_auto_grab", w_goome_ui_auto_grab},
    {"ui_window", w_goome_ui_window},
    {"ui_window_end", w_goome_ui_window_end},
    {"ui_row", w_goome_ui_row},
    {"ui_same_line", w_goome_ui_same_line},
    {"ui_space", w_goome_ui_space},
    {"ui_separator", w_goome_ui_separator},
    {"ui_width", w_goome_ui_width},
    {"ui_label", w_goome_ui_label},
    {"ui_heading", w_goome_ui_heading},
    {"ui_wrapped", w_goome_ui_wrapped},
    {"ui_button", w_goome_ui_button},
    {"ui_image_button", w_goome_ui_image_button},
    {"ui_image", w_goome_ui_image},
    {"ui_checkbox", w_goome_ui_checkbox},
    {"ui_toggle", w_goome_ui_toggle},
    {"ui_radio", w_goome_ui_radio},
    {"ui_slider", w_goome_ui_slider},
    {"ui_slider_int", w_goome_ui_slider_int},
    {"ui_input", w_goome_ui_input},
    {"ui_input_ex", w_goome_ui_input_ex},
    {"ui_combo", w_goome_ui_combo},
    {"ui_selectable", w_goome_ui_selectable},
    {"ui_tabs", w_goome_ui_tabs},
    {"ui_collapsing", w_goome_ui_collapsing},
    {"ui_progress", w_goome_ui_progress},
    {"ui_color", w_goome_ui_color},
    {"ui_tooltip", w_goome_ui_tooltip},
    {"ui_hovered", w_goome_ui_hovered},
    {"ui_scroll_begin", w_goome_ui_scroll_begin},
    {"ui_scroll_end", w_goome_ui_scroll_end},
    {"ui_push_id", w_goome_ui_push_id},
    {"ui_pop_id", w_goome_ui_pop_id},
    {"ui_app", w_goome_ui_app},
    {"ui_app_end", w_goome_ui_app_end},
    {"ui_menubar_begin", w_goome_ui_menubar_begin},
    {"ui_menubar_end", w_goome_ui_menubar_end},
    {"ui_menu_begin", w_goome_ui_menu_begin},
    {"ui_menu_end", w_goome_ui_menu_end},
    {"ui_menu_item", w_goome_ui_menu_item},
    {"ui_menu_separator", w_goome_ui_menu_separator},
    {"ui_context_begin", w_goome_ui_context_begin},
    {"ui_context_end", w_goome_ui_context_end},
    {"ui_popup_open", w_goome_ui_popup_open},
    {"ui_popup_begin", w_goome_ui_popup_begin},
    {"ui_popup_end", w_goome_ui_popup_end},
    {"ui_popup_close", w_goome_ui_popup_close},
    {"ui_modal_begin", w_goome_ui_modal_begin},
    {"ui_modal_end", w_goome_ui_modal_end},
    {"ui_toast", w_goome_ui_toast},
    {"ui_statusbar", w_goome_ui_statusbar},
    {"ui_focused", w_goome_ui_focused},
    {"ui_set_focus", w_goome_ui_set_focus},
    {"ui_text_edit", w_goome_ui_text_edit},
    {"ui_table_begin", w_goome_ui_table_begin},
    {"ui_table_column", w_goome_ui_table_column},
    {"ui_table_sort", w_goome_ui_table_sort},
    {"ui_table_row", w_goome_ui_table_row},
    {"ui_table_next", w_goome_ui_table_next},
    {"ui_table_end", w_goome_ui_table_end},
    {"ui_tree", w_goome_ui_tree},
    {"ui_tree_end", w_goome_ui_tree_end},
    {"ui_list_clip", w_goome_ui_list_clip},
    {"ui_drag_float", w_goome_ui_drag_float},
    {"ui_drag_int", w_goome_ui_drag_int},
    {"ui_number", w_goome_ui_number},
    {"ui_plot_lines", w_goome_ui_plot_lines},
    {"ui_plot_bars", w_goome_ui_plot_bars},
    {"ui_split_begin", w_goome_ui_split_begin},
    {"ui_split_next", w_goome_ui_split_next},
    {"ui_split_end", w_goome_ui_split_end},
    {"ui_drag_source", w_goome_ui_drag_source},
    {"ui_drop_target", w_goome_ui_drop_target},
    {"ui_spinner", w_goome_ui_spinner},
    {"ui_link", w_goome_ui_link},
    {"ui_badge", w_goome_ui_badge},
    {"ui_pos", w_goome_ui_pos},
    {"ui_size", w_goome_ui_size},
    {"ui_push_color", w_goome_ui_push_color},
    {"ui_push_num", w_goome_ui_push_num},
    {"ui_push_radii", w_goome_ui_push_radii},
    {"ui_push_font", w_goome_ui_push_font},
    {"ui_push_skin", w_goome_ui_push_skin},
    {"ui_push_theme", w_goome_ui_push_theme},
    {"ui_push_icon", w_goome_ui_push_icon},
    {"ui_pop", w_goome_ui_pop},
    {"ui_custom", w_goome_ui_custom},
    {"ui_canvas", w_goome_ui_canvas},
    {"ui_store", w_goome_ui_store},
    {"ui_theme_make", w_goome_ui_theme_make},
    {"ui_theme_preset", w_goome_ui_theme_preset},
    {"ui_scale", w_goome_ui_scale},
    {"ui_cfg", w_goome_ui_cfg},
    {"ui_config_default", w_goome_ui_config_default},
    {"ui_bind", w_goome_ui_bind},
};
