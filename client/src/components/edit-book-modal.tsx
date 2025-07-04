import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSelectedBook } from '@/redux/features/books/bookSlice';
import BookForm from './book-form';
import { toast } from 'sonner';
import type { BookFormData } from '@/lib/validations/book';

const EditBookModal = () => {
  const [open, setOpen] = useState(false);
  const { selectedBook } = useAppSelector(state => state.books);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (selectedBook) {
      setOpen(true);
    }

    return () => setOpen(false);
  }, [selectedBook]);

  const handleOpen = (e: boolean) => {
    dispatch(setSelectedBook(null))
    setOpen(e);
  };

  if (!selectedBook) {
    return null;
  }

  const handleClose = () => {
    dispatch(setSelectedBook(null))
    setOpen(false);
  };

  const handleSubmit = async (e: BookFormData) => {
    try {
      console.log(e)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any
      toast.error("Failed to update book", { description: error?.data?.message || error?.error || error })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className='max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:pr-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-800'>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
          <BookForm initialValues={selectedBook} onClose={handleClose} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookModal