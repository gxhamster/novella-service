"use client";
import NovellaInput from "@/components/NovellaInput";
import { useForm } from "react-hook-form";

type GeneralBookInformationForm = {
  title: string;
  author: string;
  id: number;
};

type DetailBookInformationForm = {
  genre: string;
  publisher: string;
  ddc: string;
  edition: string;
  language: string;
  year: number;
  pages: number;
  isbn: number;
  user_id: string;
};

type BookInformationForm = GeneralBookInformationForm &
  DetailBookInformationForm;

type BookInformationCatergoryCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function BookInformationCatergoryCard({
  title,
  subtitle,
  children,
}: BookInformationCatergoryCardProps) {
  return (
    <div className="bg-surface-200 flex flex-col" id={title}>
      <div className="flex gap-[15rem] justify-start px-14 py-10">
        <div className="flex flex-col flex-grow-0 max-w-[300px] min-w-[300px]">
          <h3 className="text-2xl font-light">{title}</h3>
          <span className="text-md text-surface-700 mt-3">{subtitle}</span>
        </div>
        <div className="flex flex-col gap-5 flex-grow flex-shrink-0">
          {children}
        </div>
      </div>
      {/* <div className="border-t-[1px] border-surface-300 flex justify-end px-20 py-4 gap-3 text-sm">
        <button className="px-4 py-2 bg-surface-300 min-w-[80px]">
          Cancel
        </button>
        <button className="px-4 py-2 bg-primary-400 min-w-[80px] text-surface-200">
          Save
        </button>
      </div> */}
    </div>
  );
}

export default function BookSummary({ data }: any) {
  const {
    register,
    formState: { errors },
  } = useForm<BookInformationForm>({
    defaultValues: {
      title: data.title,
      author: data.author,
      id: data.id,
      genre: data.genre,
      publisher: data.publisher,
      ddc: data.ddc,
      edition: data.edition,
      language: data.language,
      year: data.year,
      pages: data.pages,
      isbn: data.isbn,
      user_id: data.user_id,
    },
  });

  const categories = [
    "General information",
    "Publisher information",
    "Identification",
    "Miscellaneous",
    "User",
  ];

  return (
    <div className="relative">
      <div className="flex flex-col fixed">
        {categories.map((category) => (
          <a
            key={category}
            href={`#${category}`}
            className="py-2 px-6 text-sm text-surface-600 border-l-[1px] border-surface-400 hover:text-surface-900 hover:border-surface-600 focus:border-l-[1px] focus:border-primary-400 focus:text-surface-900"
          >
            {category}
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-10 flex-grow ml-[16rem]">
        <div>
          <span className="text-3xl text-surface-700">
            Books / <span className="text-surface-900"> {data.id}</span>
          </span>
        </div>
        <BookInformationCatergoryCard
          title="General information"
          subtitle="Edit the general information of the book"
        >
          <NovellaInput<"title">
            type="text"
            title="Title"
            reactHookRegister={register("title")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"author">
            type="text"
            title="Author"
            reactHookRegister={register("author")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"id">
            type="text"
            title="Reference ID"
            reactHookRegister={register("id", { disabled: true })}
            reactHookErrorMessage={errors.title}
          />
        </BookInformationCatergoryCard>
        <BookInformationCatergoryCard
          title="Publisher information"
          subtitle="Edit the information on the publishing of the book"
        >
          <NovellaInput<"publisher">
            type="text"
            title="Publisher"
            reactHookRegister={register("publisher")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"edition">
            type="text"
            title="Edition"
            reactHookRegister={register("edition")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"year">
            type="text"
            title="Year"
            reactHookRegister={register("year")}
            reactHookErrorMessage={errors.title}
          />
        </BookInformationCatergoryCard>
        <BookInformationCatergoryCard
          title="Identification"
          subtitle="Edit the information used to identify the book"
        >
          <NovellaInput<"isbn">
            type="text"
            title="ISBN"
            reactHookRegister={register("isbn")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"ddc">
            type="text"
            title="DDC"
            reactHookRegister={register("ddc")}
            reactHookErrorMessage={errors.title}
          />
        </BookInformationCatergoryCard>
        <BookInformationCatergoryCard
          title="Miscellaneous"
          subtitle="Edit the extra information about the book"
        >
          <NovellaInput<"genre">
            type="text"
            title="Genre"
            reactHookRegister={register("genre")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"language">
            type="text"
            title="Language"
            reactHookRegister={register("language")}
            reactHookErrorMessage={errors.title}
          />
          <NovellaInput<"pages">
            type="text"
            title="Pages"
            reactHookRegister={register("pages")}
            reactHookErrorMessage={errors.title}
          />
        </BookInformationCatergoryCard>
        <BookInformationCatergoryCard
          title="User"
          subtitle="The user that created the book"
        >
          <NovellaInput<"user_id">
            type="text"
            title="User ID"
            reactHookRegister={register("user_id", { disabled: true })}
            reactHookErrorMessage={errors.title}
          />
        </BookInformationCatergoryCard>
      </div>
    </div>
  );
}
