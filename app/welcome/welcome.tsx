import { useState } from "react";
import { H1, Paragraph } from "~/components/typography";
import { Textarea } from "~/components/ui/textarea";

export function Welcome() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  return (
    <div>
      <H1>Welcome</H1>
      <Paragraph className="text-muted-foreground">
        Manage your tasks easily!
      </Paragraph>
      {/* <textarea
          autoFocus
          onBlur={() => setIsEditing(false)}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          rows={1}
        /> */}
      {isEditing ? (
        <Textarea
          autoFocus
          onBlur={() => setIsEditing(false)}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          rows={1}
          className="text-sm border-none shadow-none p-1 resize-none min-h-[20px] bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded-sm overflow-hidden"
          placeholder="Add a description... (Ctrl+Enter to save, Esc to cancel)"
        />
      ) : (
        <div onClick={() => setIsEditing(true)}>{content}</div>
      )}
    </div>
  );
}
