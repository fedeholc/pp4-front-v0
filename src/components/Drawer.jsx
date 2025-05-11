// Drawer.jsx
import * as Dialog from "@radix-ui/react-dialog";
import "./Drawer.css";

export default function Drawer() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Drawer</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="drawer-header">
            <Dialog.Title>Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button className="close-button">&times;</button>
            </Dialog.Close>
          </div>
          <div className="drawer-body">
            <p>Aquí va el contenido del drawer.</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
