"use strict";
const goome = require("..");

const app = new goome.App({ title: "Notes", width: 900, height: 600, flags: goome.APP_MENUBAR | goome.APP_STATUSBAR | goome.APP_NO_PAD, minWidth: 560, minHeight: 380 });
const notes = [
  { title: "Groceries", body: "milk\neggs\ncoffee\nrice\ncat food", pinned: true },
  { title: "Release checklist", body: "bump the version\nrun the tests\nwrite the changelog\ntag it", pinned: false },
  { title: "Trip", body: "train at 8:10, book the hotel", pinned: false },
];
const about = new goome.Flag(false);
const wrap = new goome.Flag(true);
const side = new goome.Split(0.3);
let sel = 0, search = "", light = false, saved = 0;

app.onEvent((ev) => {
  if (ev.type === goome.KEY && ev.key === 110 && ev.mods & goome.CTRL) {
    notes.push({ title: "New note", body: "", pinned: false });
    sel = notes.length - 1;
    return true;
  }
  return false;
});

app.frame((ui) => {
  ui.menubar(() => {
    ui.menu("File", () => {
      if (ui.menuItem("New note", "ctrl+n")) {
        notes.push({ title: "New note", body: "", pinned: false });
        sel = notes.length - 1;
      }
      if (ui.menuItem("Save", "ctrl+s")) {
        saved++;
        ui.toast(`Saved "${notes[sel].title}"`);
      }
      ui.menuSeparator();
      if (ui.menuItem("Quit", "ctrl+q")) app.quit();
    });
    ui.menu("View", () => {
      ui.menuItem("Wrap lines", null, wrap);
      if (ui.menuItem("Light theme", null, { value: light })) {
        light = !light;
        if (light) ui.theme.light();
        else ui.theme.dark();
      }
    });
    ui.menu("Help", () => {
      if (ui.menuItem("About")) about.value = true;
    });
  });

  ui.split("main", side, () => {
    search = ui.inputEx("##search", search, 0, "search notes");
    ui.scroll("list", 0, () => {
      notes.forEach((n, i) => {
        if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return;
        ui.id(i, () => {
          if (ui.selectable((n.pinned ? "* " : "") + n.title, i === sel)) sel = i;
          ui.context("note", () => {
            if (ui.menuItem(n.pinned ? "Unpin" : "Pin")) n.pinned = !n.pinned;
            if (ui.menuItem("Delete") && notes.length > 1) {
              notes.splice(i, 1);
              sel = Math.min(sel, notes.length - 1);
            }
          });
        });
      });
    });
    ui.splitNext();
    const n = notes[sel];
    n.title = ui.input("Title", n.title, 128);
    n.body = ui.textEdit("body" + sel, n.body, 0, goome.EDIT_LINE_NUMBERS | (wrap.value ? goome.EDIT_WRAP : 0));
  });

  ui.statusbar(`${notes.length} notes, saved ${saved} times`);

  ui.modal("About", about, () => {
    ui.label(`goome ${goome.VERSION} on ${app.g.backendName}`);
    if (ui.button("Close")) ui.popupClose();
  });
});

app.run();
