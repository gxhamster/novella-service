import AlertIcon from "@/components/icons/AlertIcon";
import { Alert, Stack, Text, Button } from "@mantine/core";

type BookDeleteCardProps = {
  onClick: () => void;
};

export default function BookDeleteCard({ onClick }: BookDeleteCardProps) {
  return (
    <Alert
      variant="light"
      color="red"
      title="Delete book from library"
      icon={<AlertIcon size={20} className="" />}
    >
      <Stack justify="flex-start" align="flex-start">
        <Text size="sm" c="red">
          Deleting this book remove it from the database. Please note that the
          book cannot be recovered if deleted.
        </Text>
        <Button variant="filled" miw={100} onClick={onClick} color="red">
          Delete book
        </Button>
      </Stack>
    </Alert>
  );
}
