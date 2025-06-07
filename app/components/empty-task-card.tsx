import { useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Circle } from "lucide-react";
import { useSubmit } from "react-router";

interface EmptyTaskCardProps {
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
}

export default function EmptyTaskCard({
  onCancel,
  onSave,
}: EmptyTaskCardProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const submit = useSubmit();
  const handleSave = () => {
    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("status", "TODO");
    submit(formData, { method: "POST" });
    onSave(title, description);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (title.trim()) {
        handleSave();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="mt-2 max-w-full border-2 border-blue-300 border-dashed">
      <Card className="p-2 gap-0 bg-blue-50 w-full">
        <CardTitle className="mb-2">
          <div className="inline-block bg-accent p-1 rounded-sm">
            <Circle size={15} className="text-muted-foreground"></Circle>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
            onKeyDown={handleTitleKeyDown}
            className="inline-block align-text-top ml-2 h-auto border-none shadow-none p-0 text-base font-semibold bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded-sm"
            placeholder="Enter task title..."
            autoFocus
          />
        </CardTitle>
        <div className="mt-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            className="text-sm border-none shadow-none p-1 resize-none min-h-[20px] bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded-sm"
            placeholder="Add description (optional)... Ctrl+Enter to save, Esc to cancel"
            rows={2}
          />
        </div>
      </Card>
    </div>
  );
}
