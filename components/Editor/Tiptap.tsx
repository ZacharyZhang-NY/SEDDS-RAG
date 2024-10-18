"use client";

import "./styles.scss";

import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";

import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import MenuBar from "./MenuBar.jsx";
import { clsx } from "clsx";
import Placeholder from "@tiptap/extension-placeholder";

interface TiptapProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  onValueGet: (html: string) => void;
  props?: any;
}

const Tiptap = ({ content, onValueGet, ...props }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount,
      Placeholder.configure({
        placeholder: "支持 Markdown 语法输入",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "h-full prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    content,
  });

  useEffect(() => {
    if (editor) {
      const handleEditorUpdate = () => {
        onValueGet(editor.getHTML());
      };
      editor.on("update", handleEditorUpdate);
      return () => {
        editor.off("update", handleEditorUpdate);
      };
    }
  }, [editor, onValueGet]);

  return (
    <div className={clsx("editor")}>
      {editor && <MenuBar editor={editor} />}
      <EditorContent className="editor__content" editor={editor} {...props} />
      <div className="editor__footer">
        <div className="editor__name">
          当前字数: {editor?.storage.characterCount.characters()}
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
