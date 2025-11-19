# WriterDesk WebOS

![License](https://img.shields.io/badge/license-GNU_GPL_v3-blue.svg)
![React](https://img.shields.io/badge/react-18.2-61DAFB.svg)
![Vite](https://img.shields.io/badge/vite-4.0-646CFF.svg)
![Tailwind](https://img.shields.io/badge/tailwind-3.3-38B2AC.svg)

> **WriterDesk WebOS** is a web simulation of a standalone environment for writers.  
> Minimalism. Monochrome. Full focus. Air-gapped data transfer.

The project implements the interface of a dedicated text-drafting device in the browser, simulating a local file system and hardware keys, and introduces a unique data transfer protocol using a video stream of QR codes.

---

## ✨ Features

### 🧬 “Distraction Free” Philosophy
* **Monochrome interface:** High-contrast color scheme (WCAG AA) emulating e-ink displays.
* **No notifications:** Complete isolation from the outside world.
* **Focus on text:** No extra toolbars. Just you and the cursor.

### 🖥️ WebOS Emulation
* **Mock File System:** Create, delete, and rename folders and files (data is stored in `localStorage`).
* **Device Bar & Status Bar:** Displays battery level, time, word count, and file state in real time.
* **Keyboard control:** Full support for hotkeys (`Ctrl+S`, `F2`, `Esc`, etc.) as described in the device documentation.

### 📡 “QR-Stream” Technology (Air-Gap)
A unique implementation of one-way data transfer for isolated environments:
1. **Export (Desktop):** The document is split into chunks, hashed (SHA-256), and broadcast as a QR-code animation (2.5 FPS).
2. **Import (Mobile):** The camera reads the stream, reassembles the packets, verifies hash integrity, and restores the document.

---

## 🛠️ Tech Stack

* **Core:** React 18 + Vite
* **Styling:** Tailwind CSS (custom config)
* **Cryptography:** `crypto-js` (SHA-256 verification)
* **QR Protocol:** `react-qr-code` (render), `html5-qrcode` (scan)
* **Icons:** Lucide React

---

## 🚀 Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/writerdesk-webos.git

# 2. Go into the project directory
cd writerdesk-webos

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
````

The app will be available at `http://localhost:5173`.

---

## ⌨️ Controls (Shortcuts)

The app intercepts system key presses to fully emulate the device:

| Key          | Action                   | Context      |
| :----------- | :----------------------- | :----------- |
| **Ctrl + S** | Save file                | Editor       |
| **Ctrl + Q** | Quit without saving      | Editor       |
| **F2**       | Rename                   | File Manager |
| **F3**       | New file                 | File Manager |
| **F6**       | Export (QR-Stream)       | Editor       |
| **Esc**      | Cancel / Go up one level | Global       |

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── FileSystem/    # File manager logic
│   ├── Editor/        # Text editor
│   ├── QR/            # Export and import (Stream) modules
│   └── Layout/        # System panels (Status/Device Bars)
├── hooks/             # Custom hooks (useFileSystem, useQRStream)
├── utils/             # Protocol logic, hashing, formatters
└── ...
```

---

## 🔒 Protocol Security

Data transfer via QR-Stream is protected at the integrity level:

1. **Serialization:** Base64 encoding to support Unicode.
2. **Chunking:** Splitting into 250-byte packets.
3. **Verification:** Each packet contains the SHA-256 hash of the original file. The file cannot be reassembled if the hash does not match.

---

## 📄 License

Distributed under the GNU GPL LICENSE. See the `LICENSE` file for more information.
