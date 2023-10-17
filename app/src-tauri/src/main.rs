// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::borrow::BorrowMut;

use tauri::{CustomMenuItem, Menu, MenuEntry};

use crate::events::EVENT_MENU_OPEN;

mod git;
mod events;

fn main() {
    tauri::Builder::default()
        .menu(setup_menu())
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "open" => {
                    event.window().emit(EVENT_MENU_OPEN, 0).unwrap();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![git::git_stats, git::git_total_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_menu() -> Menu {
    let mut menu = Menu::os_default("Git Statistics");

    let file_menu_index;
    #[cfg(target_os = "macos")]
    {
        file_menu_index = 1;
    }
    #[cfg(not(target_os = "macos"))]
    {
        file_menu_index = 0;
    }


    if let MenuEntry::Submenu(file_menu) = &mut menu.items[file_menu_index] {
        let open_repo = CustomMenuItem::new("open".to_string(), "Open Repository").accelerator("CmdOrCtrl+0");
        file_menu.inner.borrow_mut().items.insert(0, MenuEntry::CustomItem(open_repo));
    }
    menu
}

