/** Backend id for the backend option. */
export declare const AUTO: number;
/** Backend id for the backend option. */
export declare const WAYLAND: number;
/** Backend id for the backend option. */
export declare const GNOME: number;
/** Backend id for the backend option. */
export declare const PORTAL: number;
/** Backend id for the backend option. */
export declare const X11: number;
/** Backend id for the backend option. */
export declare const WIN32: number;
/** Backend id for the backend option. */
export declare const MACOS: number;
/** Backend id for the backend option. */
export declare const TEST: number;
/** Backend id for the backend option. */
export declare const OFFSCREEN: number;
/** See-through overlay on top of the desktop. */
export declare const MODE_OVERLAY: number;
/** A normal window. */
export declare const MODE_WINDOW: number;
/** No window, you read the pixels. */
export declare const MODE_OFFSCREEN: number;
/** Window flag: the user can resize it. */
export declare const WINDOW_RESIZABLE: number;
/** Window flag: no border. */
export declare const WINDOW_BORDERLESS: number;
/** Window flag: transparent background. */
export declare const WINDOW_TRANSPARENT: number;
/** Window flag: stays on top of other windows. */
export declare const WINDOW_ON_TOP: number;
/** Window flag: starts hidden. */
export declare const WINDOW_HIDDEN: number;
/** Window flag: opens centered. */
export declare const WINDOW_CENTER: number;
/** Window flag: no title bar. */
export declare const WINDOW_NO_TITLEBAR: number;
/** Window flag: no console window (Windows). */
export declare const WINDOW_NO_CONSOLE: number;
/** Success, 0. */
export declare const OK: number;
/** Error code: not supported here. */
export declare const ENOTSUP: number;
/** Error code: denied. */
export declare const EDENIED: number;
/** Error code: no display. */
export declare const ENODISPLAY: number;
/** Error code: it is gone. */
export declare const EGONE: number;
/** Error code: not ready, try again. */
export declare const EAGAIN: number;
/** Error code: out of memory. */
export declare const ENOMEM: number;
/** Error code: bad argument. */
export declare const EARG: number;
/** Capability: screen capture. */
export declare const CAP_CAPTURE: number;
/** Capability: global pointer position. */
export declare const CAP_GLOBAL_POINTER: number;
/** Capability: global hotkeys. */
export declare const CAP_HOTKEYS: number;
/** Capability: keeping our overlay out of grabs. */
export declare const CAP_HIDE_SELF: number;
/** Capability: keyboard capture. */
export declare const CAP_KEYBOARD: number;
/** Capability: window control. */
export declare const CAP_WINDOW: number;
/** Capability: clipboard. */
export declare const CAP_CLIPBOARD: number;
/** Capability: cursor shapes. */
export declare const CAP_CURSOR: number;
/** Capability: grabbing focus and the pointer. */
export declare const CAP_GRAB: number;
/** The ui wants the mouse. */
export declare const WANT_MOUSE: number;
/** The ui wants the keyboard. */
export declare const WANT_KEYBOARD: number;
/** Event type: nothing happened. */
export declare const NONE: number;
/** Event type: a mouse button went down. */
export declare const DOWN: number;
/** Event type: a mouse button went up. */
export declare const UP: number;
/** Event type: the pointer moved. */
export declare const MOTION: number;
/** Event type: the wheel scrolled. */
export declare const SCROLL: number;
/** Event type: a key was pressed. */
export declare const KEY: number;
/** Event type: a registered hotkey fired. */
export declare const HOTKEY: number;
/** Event type: a line came in on the control fifo. */
export declare const CONTROL: number;
/** Event type: the monitors changed. */
export declare const MONITORS: number;
/** Event type: the session is quitting. */
export declare const QUIT: number;
/** Event type: window close button, alt-f4 or cmd-w. The app decides. */
export declare const CLOSE: number;
/** Event type: focus changed, id is 1 when gained and 0 when lost. */
export declare const FOCUS: number;
/** Event type: a file was dropped on the window, see Event.path. */
export declare const DROP: number;
/** Event type: an ime, dead key or compose finished some text. */
export declare const TEXT: number;
/** Event type: the text being composed changed. Empty means composing ended. */
export declare const PREEDIT: number;
/** Cursor shape: arrow. */
export declare const CURSOR_ARROW: number;
/** Cursor shape: text beam. */
export declare const CURSOR_IBEAM: number;
/** Cursor shape: hand. */
export declare const CURSOR_HAND: number;
/** Cursor shape: move. */
export declare const CURSOR_MOVE: number;
/** Cursor shape: resize left and right. */
export declare const CURSOR_RESIZE_EW: number;
/** Cursor shape: resize up and down. */
export declare const CURSOR_RESIZE_NS: number;
/** Cursor shape: resize top left to bottom right. */
export declare const CURSOR_RESIZE_NWSE: number;
/** Cursor shape: resize top right to bottom left. */
export declare const CURSOR_RESIZE_NESW: number;
/** Cursor shape: busy. */
export declare const CURSOR_WAIT: number;
/** Cursor shape: not allowed. */
export declare const CURSOR_NO: number;
/** Cursor shape: no cursor. */
export declare const CURSOR_HIDDEN: number;
/** Window edge bit for Goome.drag. */
export declare const EDGE_LEFT: number;
/** Window edge bit for Goome.drag. */
export declare const EDGE_RIGHT: number;
/** Window edge bit for Goome.drag. */
export declare const EDGE_TOP: number;
/** Window edge bit for Goome.drag. */
export declare const EDGE_BOTTOM: number;
/** Window state: normal. */
export declare const STATE_NORMAL: number;
/** Window state: minimized. */
export declare const STATE_MINIMIZED: number;
/** Window state: maximized. */
export declare const STATE_MAXIMIZED: number;
/** Window state: fullscreen. */
export declare const STATE_FULLSCREEN: number;
/** Key code for backspace. */
export declare const K_BACKSPACE: number;
/** Key code for tab. */
export declare const K_TAB: number;
/** Key code for enter. */
export declare const K_ENTER: number;
/** Key code for esc. */
export declare const K_ESC: number;
/** Key code for space. */
export declare const K_SPACE: number;
/** Key code for delete. */
export declare const K_DELETE: number;
/** Key code for F1. F2 to F11 follow in order. */
export declare const K_F1: number;
/** Key code for F12. */
export declare const K_F12: number;
/** Key code for left. */
export declare const K_LEFT: number;
/** Key code for right. */
export declare const K_RIGHT: number;
/** Key code for up. */
export declare const K_UP: number;
/** Key code for down. */
export declare const K_DOWN: number;
/** Key code for home. */
export declare const K_HOME: number;
/** Key code for end. */
export declare const K_END: number;
/** Key code for page up. */
export declare const K_PGUP: number;
/** Key code for page down. */
export declare const K_PGDN: number;
/** Key code for insert. */
export declare const K_INSERT: number;
/** Shift modifier bit. */
export declare const SHIFT: number;
/** Ctrl modifier bit. */
export declare const CTRL: number;
/** Alt modifier bit. */
export declare const ALT: number;
/** Super (windows or cmd) modifier bit. */
export declare const SUPER: number;
/** Byte order for frameCopy: B,G,R,A premultiplied. */
export declare const FMT_BGRA_PREMUL: number;
/** Byte order for frameCopy: R,G,B,A premultiplied. */
export declare const FMT_RGBA_PREMUL: number;
/** Byte order for frameCopy: B,G,R,A, unpremultiplied for you. */
export declare const FMT_BGRA: number;
/** Byte order for frameCopy: R,G,B,A, unpremultiplied for you. */
export declare const FMT_RGBA: number;
/** Text direction from the first strong letter of each line. */
export declare const DIR_AUTO: number;
/** Text direction left to right. */
export declare const DIR_LTR: number;
/** Text direction right to left. */
export declare const DIR_RTL: number;
/** Icon slot: arrow down. */
export declare const ICON_ARROW_DOWN: number;
/** Icon slot: arrow right. */
export declare const ICON_ARROW_RIGHT: number;
/** Icon slot: arrow up. */
export declare const ICON_ARROW_UP: number;
/** Icon slot: arrow left. */
export declare const ICON_ARROW_LEFT: number;
/** Icon slot: check. */
export declare const ICON_CHECK: number;
/** Icon slot: radio dot. */
export declare const ICON_RADIO_DOT: number;
/** Icon slot: close. */
export declare const ICON_CLOSE: number;
/** Icon slot: minimize. */
export declare const ICON_MINIMIZE: number;
/** Icon slot: maximize. */
export declare const ICON_MAXIMIZE: number;
/** Icon slot: restore. */
export declare const ICON_RESTORE: number;
/** Icon slot: resize. */
export declare const ICON_RESIZE: number;
/** Icon slot: sort up. */
export declare const ICON_SORT_UP: number;
/** Icon slot: sort down. */
export declare const ICON_SORT_DOWN: number;
/** Icon slot: plus. */
export declare const ICON_PLUS: number;
/** Icon slot: minus. */
export declare const ICON_MINUS: number;
/** Icon slot: slider knob. */
export declare const ICON_SLIDER_KNOB: number;
/** Icon slot: toggle knob. */
export declare const ICON_TOGGLE_KNOB: number;
/** Icon slot: collapse. */
export declare const ICON_COLLAPSE: number;
/** Icon slot: expand. */
export declare const ICON_EXPAND: number;
/** Icon slot: drag handle. */
export declare const ICON_DRAG_HANDLE: number;
/** Icon slot: toast. */
export declare const ICON_TOAST: number;
/** Icon slot: picker. */
export declare const ICON_PICKER: number;
/** How many icon slots there are. */
export declare const ICON_COUNT: number;
/** Window flag: can be dragged by its title. */
export declare const WIN_MOVE: number;
/** Window flag: can be resized. */
export declare const WIN_RESIZE: number;
/** Window flag: can be collapsed. */
export declare const WIN_COLLAPSE: number;
/** Window flag: no title bar. */
export declare const WIN_NO_TITLE: number;
/** Window flag: shows a close button. */
export declare const WIN_CLOSE: number;
/** Input flag: hides the text. */
export declare const INPUT_PASSWORD: number;
/** Input flag: can be selected but not edited. */
export declare const INPUT_READONLY: number;
/** Input flag: numbers only. */
export declare const INPUT_NUMBER: number;
/** Input flag: dont select everything on focus. */
export declare const INPUT_NO_SELECT_ON_FOCUS: number;
/** Input flag: enter sets Ui.entered. */
export declare const INPUT_ENTER_RETURNS: number;
/** App flag: draw a title bar. */
export declare const APP_TITLEBAR: number;
/** App flag: reserve room for a menu bar. */
export declare const APP_MENUBAR: number;
/** App flag: reserve room for a status bar. */
export declare const APP_STATUSBAR: number;
/** App flag: no padding around the content. */
export declare const APP_NO_PAD: number;
/** Text edit flag: read only. */
export declare const EDIT_READONLY: number;
/** Text edit flag: show line numbers. */
export declare const EDIT_LINE_NUMBERS: number;
/** Text edit flag: wrap long lines. */
export declare const EDIT_WRAP: number;
/** Text edit flag: mono font. */
export declare const EDIT_MONO: number;
/** Table flag: columns can be sorted by clicking the header. */
export declare const TABLE_SORTABLE: number;
/** Table flag: columns can be resized. */
export declare const TABLE_RESIZABLE: number;
/** Table flag: striped rows. */
export declare const TABLE_STRIPES: number;
/** Table flag: cell borders. */
export declare const TABLE_BORDERS: number;
/** Style id for the theme's bg. */
export declare const S_BG: number;
/** Style id for the theme's panel. */
export declare const S_PANEL: number;
/** Style id for the theme's border. */
export declare const S_BORDER: number;
/** Style id for the theme's text. */
export declare const S_TEXT: number;
/** Style id for the theme's text dim. */
export declare const S_TEXT_DIM: number;
/** Style id for the theme's accent. */
export declare const S_ACCENT: number;
/** Style id for the theme's accent text. */
export declare const S_ACCENT_TEXT: number;
/** Style id for the theme's hover. */
export declare const S_HOVER: number;
/** Style id for the theme's active. */
export declare const S_ACTIVE: number;
/** Style id for the theme's input bg. */
export declare const S_INPUT_BG: number;
/** Style id for the theme's shadow. */
export declare const S_SHADOW: number;
/** Style id for the theme's radius. */
export declare const S_RADIUS: number;
/** Style id for the theme's pad. */
export declare const S_PAD: number;
/** Style id for the theme's gap. */
export declare const S_GAP: number;
/** Style id for the theme's border width. */
export declare const S_BORDER_WIDTH: number;
/** Style id for the theme's font size. */
export declare const S_FONT_SIZE: number;
/** Style id for the theme's shadow blur. */
export declare const S_SHADOW_BLUR: number;
/** Style id for the theme's anim ms. */
export declare const S_ANIM_MS: number;
/** Style id for the theme's focus. */
export declare const S_FOCUS: number;
/** Style id for the theme's select. */
export declare const S_SELECT: number;
/** Style id for the theme's caret. */
export declare const S_CARET: number;
/** Style id for the theme's link. */
export declare const S_LINK: number;
/** Style id for the theme's badge. */
export declare const S_BADGE: number;
/** Style id for the theme's toast. */
export declare const S_TOAST: number;
/** Style id for the theme's tooltip. */
export declare const S_TOOLTIP: number;
/** Style id for the theme's danger. */
export declare const S_DANGER: number;
/** Style id for the theme's knob. */
export declare const S_KNOB: number;
/** Style id for the theme's dim. */
export declare const S_DIM: number;
/** Style id for the theme's check size. */
export declare const S_CHECK_SIZE: number;
/** Style id for the theme's check radius. */
export declare const S_CHECK_RADIUS: number;
/** Style id for the theme's toggle w. */
export declare const S_TOGGLE_W: number;
/** Style id for the theme's toggle h. */
export declare const S_TOGGLE_H: number;
/** Style id for the theme's slider h. */
export declare const S_SLIDER_H: number;
/** Style id for the theme's slider track. */
export declare const S_SLIDER_TRACK: number;
/** Style id for the theme's knob size. */
export declare const S_KNOB_SIZE: number;
/** Style id for the theme's scroll w. */
export declare const S_SCROLL_W: number;
/** Style id for the theme's scroll min. */
export declare const S_SCROLL_MIN: number;
/** Style id for the theme's item h. */
export declare const S_ITEM_H: number;
/** Style id for the theme's menu item h. */
export declare const S_MENU_ITEM_H: number;
/** Style id for the theme's tab h. */
export declare const S_TAB_H: number;
/** Style id for the theme's win title h. */
export declare const S_WIN_TITLE_H: number;
/** Style id for the theme's app title h. */
export declare const S_APP_TITLE_H: number;
/** Style id for the theme's menubar h. */
export declare const S_MENUBAR_H: number;
/** Style id for the theme's statusbar h. */
export declare const S_STATUSBAR_H: number;
/** Style id for the theme's focus w. */
export declare const S_FOCUS_W: number;
/** Style id for the theme's focus gap. */
export declare const S_FOCUS_GAP: number;
/** Style id for the theme's sep w. */
export declare const S_SEP_W: number;
/** Style id for the theme's grip. */
export declare const S_GRIP: number;
/** Style id for the theme's indent. */
export declare const S_INDENT: number;
/** Style id for the theme's plot w. */
export declare const S_PLOT_W: number;
/** Style id for the theme's spinner. */
export declare const S_SPINNER: number;
/** Style id for the theme's caret w. */
export declare const S_CARET_W: number;
/** Style id for the theme's win min w. */
export declare const S_WIN_MIN_W: number;
/** Style id for the theme's win min h. */
export declare const S_WIN_MIN_H: number;
/** Style id for the theme's pop gap. */
export declare const S_POP_GAP: number;
/** Style id for the theme's menu gap. */
export declare const S_MENU_GAP: number;
/** Style id for the theme's tip pad x. */
export declare const S_TIP_PAD_X: number;
/** Style id for the theme's tip pad y. */
export declare const S_TIP_PAD_Y: number;
/** Style id for the theme's tip x. */
export declare const S_TIP_X: number;
/** Style id for the theme's tip y. */
export declare const S_TIP_Y: number;
/** Style id for the theme's tip radius. */
export declare const S_TIP_RADIUS: number;
/** Style id for the theme's shadow x. */
export declare const S_SHADOW_X: number;
/** Style id for the theme's shadow y. */
export declare const S_SHADOW_Y: number;
/** Style id for the theme's align. */
export declare const S_ALIGN: number;
/** Style id for the theme's heading size. */
export declare const S_HEADING_SIZE: number;
/** Style id for the theme's small size. */
export declare const S_SMALL_SIZE: number;
/** Style id for the theme's ease. */
export declare const S_EASE: number;
/** Style id for the theme's hover ms. */
export declare const S_HOVER_MS: number;
/** Style id for the theme's press ms. */
export declare const S_PRESS_MS: number;
/** Style id for the theme's popup ms. */
export declare const S_POPUP_MS: number;
/** Style id for the theme's collapse ms. */
export declare const S_COLLAPSE_MS: number;
/** Style id for the theme's toast fade ms. */
export declare const S_TOAST_FADE_MS: number;
/** How many style fields there are. */
export declare const S_COUNT: number;
/** Text alignment: automatic. */
export declare const ALIGN_AUTO: number;
/** Text alignment: left. */
export declare const ALIGN_LEFT: number;
/** Text alignment: center. */
export declare const ALIGN_CENTER: number;
/** Text alignment: right. */
export declare const ALIGN_RIGHT: number;
/** Easing curve: smooth. */
export declare const EASE_SMOOTH: number;
/** Easing curve: linear. */
export declare const EASE_LINEAR: number;
/** Easing curve: out. */
export declare const EASE_OUT: number;
/** Easing curve: in out. */
export declare const EASE_IN_OUT: number;
/** Easing curve: back. */
export declare const EASE_BACK: number;
/** Easing curve: custom. */
export declare const EASE_CUSTOM: number;
/** Easing curve: in. */
export declare const EASE_IN: number;
/** Easing curve: spring. */
export declare const EASE_SPRING: number;
/** Easing curve: bounce. */
export declare const EASE_BOUNCE: number;
/** Skin slot for button. */
export declare const SKIN_BUTTON: number;
/** Skin slot for panel. */
export declare const SKIN_PANEL: number;
/** Skin slot for input. */
export declare const SKIN_INPUT: number;
/** Skin slot for checkbox. */
export declare const SKIN_CHECKBOX: number;
/** Skin slot for radio. */
export declare const SKIN_RADIO: number;
/** Skin slot for toggle. */
export declare const SKIN_TOGGLE: number;
/** Skin slot for slider track. */
export declare const SKIN_SLIDER_TRACK: number;
/** Skin slot for slider fill. */
export declare const SKIN_SLIDER_FILL: number;
/** Skin slot for scrollbar. */
export declare const SKIN_SCROLLBAR: number;
/** Skin slot for tab. */
export declare const SKIN_TAB: number;
/** Skin slot for titlebar. */
export declare const SKIN_TITLEBAR: number;
/** Skin slot for tooltip. */
export declare const SKIN_TOOLTIP: number;
/** Skin slot for menu. */
export declare const SKIN_MENU: number;
/** Skin slot for popup. */
export declare const SKIN_POPUP: number;
/** How many skin slots there are. */
export declare const SKIN_COUNT: number;
/** Custom widget flag: drags lock to the x axis. */
export declare const ITEM_DRAG_X: number;
/** Custom widget flag: drags lock to the y axis. */
export declare const ITEM_DRAG_Y: number;
/** Custom widget flag: it can take keyboard focus. */
export declare const ITEM_FOCUSABLE: number;
/** Custom widget flag: it doesnt take clicks. */
export declare const ITEM_NO_HIT: number;
/** Custom widget flag: holding it repeats clicks. */
export declare const ITEM_REPEAT: number;
/** Theme preset: dark. */
export declare const PRESET_DARK: number;
/** Theme preset: light. */
export declare const PRESET_LIGHT: number;
/** Theme preset: midnight. */
export declare const PRESET_MIDNIGHT: number;
/** Theme preset: paper. */
export declare const PRESET_PAPER: number;
/** Theme preset: mint. */
export declare const PRESET_MINT: number;
/** Theme preset: high contrast. */
export declare const PRESET_HIGH_CONTRAST: number;
/** Theme preset: rose. */
export declare const PRESET_ROSE: number;
/** How many theme presets there are. */
export declare const PRESET_COUNT: number;
/** Editing action you can rebind: copy. */
export declare const ACT_COPY: number;
/** Editing action you can rebind: cut. */
export declare const ACT_CUT: number;
/** Editing action you can rebind: paste. */
export declare const ACT_PASTE: number;
/** Editing action you can rebind: undo. */
export declare const ACT_UNDO: number;
/** Editing action you can rebind: redo. */
export declare const ACT_REDO: number;
/** Editing action you can rebind: select all. */
export declare const ACT_SELECT_ALL: number;
/** Editing action you can rebind: word left. */
export declare const ACT_WORD_LEFT: number;
/** Editing action you can rebind: word right. */
export declare const ACT_WORD_RIGHT: number;
/** Editing action you can rebind: del word left. */
export declare const ACT_DEL_WORD_LEFT: number;
/** Editing action you can rebind: del word right. */
export declare const ACT_DEL_WORD_RIGHT: number;
/** Editing action you can rebind: doc start. */
export declare const ACT_DOC_START: number;
/** Editing action you can rebind: doc end. */
export declare const ACT_DOC_END: number;
/** How many editing actions there are. */
export declare const ACT_COUNT: number;
/** Cursor slot in Config: button. */
export declare const CUR_BUTTON: number;
/** Cursor slot in Config: input. */
export declare const CUR_INPUT: number;
/** Cursor slot in Config: link. */
export declare const CUR_LINK: number;
/** Cursor slot in Config: drag value. */
export declare const CUR_DRAG_VALUE: number;
/** Cursor slot in Config: split x. */
export declare const CUR_SPLIT_X: number;
/** Cursor slot in Config: split y. */
export declare const CUR_SPLIT_Y: number;
/** Cursor slot in Config: grip. */
export declare const CUR_GRIP: number;
/** Cursor slot in Config: column. */
export declare const CUR_COLUMN: number;
/** Cursor slot in Config: drag drop. */
export declare const CUR_DRAG_DROP: number;
/** Cursor slot in Config: custom x. */
export declare const CUR_CUSTOM_X: number;
/** Cursor slot in Config: custom y. */
export declare const CUR_CUSTOM_Y: number;
/** Cursor slot in Config: custom xy. */
export declare const CUR_CUSTOM_XY: number;
/** How many cursor slots there are. */
export declare const CUR_COUNT: number;
/** Accessibility role: none. */
export declare const ROLE_NONE: number;
/** Accessibility role: window. */
export declare const ROLE_WINDOW: number;
/** Accessibility role: button. */
export declare const ROLE_BUTTON: number;
/** Accessibility role: checkbox. */
export declare const ROLE_CHECKBOX: number;
/** Accessibility role: radio. */
export declare const ROLE_RADIO: number;
/** Accessibility role: slider. */
export declare const ROLE_SLIDER: number;
/** Accessibility role: text. */
export declare const ROLE_TEXT: number;
/** Accessibility role: input. */
export declare const ROLE_INPUT: number;
/** Accessibility role: combo. */
export declare const ROLE_COMBO: number;
/** Accessibility role: list. */
export declare const ROLE_LIST: number;
/** Accessibility role: item. */
export declare const ROLE_ITEM: number;
/** Accessibility role: tab. */
export declare const ROLE_TAB: number;
/** Accessibility role: menu. */
export declare const ROLE_MENU: number;
/** Accessibility role: menuitem. */
export declare const ROLE_MENUITEM: number;
/** Accessibility role: table. */
export declare const ROLE_TABLE: number;
/** Accessibility role: tree. */
export declare const ROLE_TREE: number;
/** Accessibility role: progress. */
export declare const ROLE_PROGRESS: number;
/** Accessibility role: image. */
export declare const ROLE_IMAGE: number;
/** Accessibility role: group. */
export declare const ROLE_GROUP: number;
/** Accessibility role: dialog. */
export declare const ROLE_DIALOG: number;
/** Accessibility state bit: focused. */
export declare const A11Y_FOCUSED: number;
/** Accessibility state bit: checked. */
export declare const A11Y_CHECKED: number;
/** Accessibility state bit: disabled. */
export declare const A11Y_DISABLED: number;
/** Accessibility state bit: expanded. */
export declare const A11Y_EXPANDED: number;
/** Accessibility state bit: selected. */
export declare const A11Y_SELECTED: number;
