import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react'
import { FiX } from 'react-icons/fi'
import type { City } from '../services/api'
import Search from './Search'

interface Props {
  open: boolean
  dismissible: boolean
  onClose: () => void
  onSelect: (city: City) => void
}

function SearchModal({ open, dismissible, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleCancel(e: SyntheticEvent) {
    if (!dismissible) e.preventDefault()
  }

  function handleClose() {
    // Browsers may force-close on repeated Escape, so reopen while a city is required
    if (dismissible) onClose()
    else ref.current?.showModal()
  }

  function handleBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (dismissible && e.target === e.currentTarget) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="search-title"
      onCancel={handleCancel}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      {open && (
        <div className="modal-body">
          <h2 id="search-title">Város keresése</h2>
          <Search onSelect={onSelect} />
          {dismissible && (
            <button type="button" className="modal-close" onClick={onClose} aria-label="Bezárás">
              <FiX aria-hidden />
            </button>
          )}
        </div>
      )}
    </dialog>
  )
}

export default SearchModal
