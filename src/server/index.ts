// Defines all the API procedures
import { router } from "./trpc";
import { BooksRouter } from "./routes/books";
import { IssueRouter } from "./routes/issue";
import { HistoryRouter } from "./routes/history";
import { StudentRouter } from "./routes/student";

export const appRouter = router({
  books: BooksRouter,
  issued: IssueRouter,
  history: HistoryRouter,
  students: StudentRouter,
});

// This type will be used as a reference later...
export type AppRouter = typeof appRouter;
