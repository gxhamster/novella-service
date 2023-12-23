import { Modal, Stack, Group, Button, Text } from "@mantine/core";

type NDeleteModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
};

export default function DeleteModal({
  title = "Confirm to delete",
  description = "Are you sure you want to delete the selected rows? This action cannot be undone",
  isOpen,
  isDeleting = false,
  closeModal,
  onDelete,
}: NDeleteModalProps) {
  return (
    <Modal opened={isOpen} onClose={closeModal} title={title} centered>
      <Stack gap={20}>
        <Text size="md" c="dark.2">
          {description}
        </Text>
        <Group gap={15} justify="end">
          <Button variant="default" size="md" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            size="md"
            loading={isDeleting}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
