import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "./ui/dialog"
import { setOpenBorrowModal, setSelectedBook } from "@/redux/features/books/bookSlice";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { borrowSchema, type BorrowFormData } from "@/lib/validations/borrow";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Save, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useBorrowBookMutation } from "@/redux/features/borrow/borrowApi";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect } from "react";

const BorrowModal = () => {
  const { selectedBook, openBorrowModal } = useAppSelector(state => state.books);
  const dispatch = useAppDispatch();
  const [borrowBook, { isLoading: isSubmitting }] = useBorrowBookMutation()

  const handleOpen = (e: boolean) => {
    dispatch(setSelectedBook(null))
    dispatch(setOpenBorrowModal(e))
  };

  const handleClose = () => {
    dispatch(setSelectedBook(null))
    dispatch(setOpenBorrowModal(false));
  };

  const form = useForm<z.infer<typeof borrowSchema>>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      book: selectedBook?._id,
      quantity: 1,
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (selectedBook) {
      form.reset({
        book: selectedBook._id,
        quantity: 1,
        dueDate: new Date(),
      });
    }
  }, [selectedBook, form]);

  const handleSubmit = async (e: BorrowFormData) => {
    try {

      await borrowBook(e).unwrap();
      toast.success("Book borrowed successfully!");
      handleClose();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any
      toast.error("Failed to update book", { description: error?.data?.message || error?.error || error })
    }
  };

  if (!selectedBook) {
    return null;
  }
  return (
    <Dialog open={openBorrowModal} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Borrow Book</DialogTitle>
          <DialogDescription>
            Borrow &apos;{selectedBook.title}&apos; from the library.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={selectedBook.copies}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold min-w-[120px] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BorrowModal