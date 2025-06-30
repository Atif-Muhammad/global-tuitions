import React, { useEffect, useState } from "react";
import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { Extension } from "@tiptap/core";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import { Button, Menu } from "@mantine/core";

export function Mantine({ formdata, handleQuillChange }) {
  const CustomBulletList = BulletList.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        "data-style": {
          default: null,
          parseHTML: (element) => element.getAttribute("data-style") || null,
          renderHTML: (attributes) => {
            return attributes["data-style"]
              ? { "data-style": attributes["data-style"] }
              : {};
          },
        },
        style: {
          default: null,
          parseHTML: (element) => element.getAttribute("style") || null,
          renderHTML: (attributes) => {
            return attributes.style ? { style: attributes.style } : {};
          },
        },
      };
    },
  });

  const CustomOrderedList = OrderedList.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        "data-style": {
          default: null,
          parseHTML: (element) => element.getAttribute("data-style") || null,
          renderHTML: (attributes) => {
            return attributes["data-style"]
              ? { "data-style": attributes["data-style"] }
              : {};
          },
        },
        style: {
          default: null,
          parseHTML: (element) => element.getAttribute("style") || null,
          renderHTML: (attributes) => {
            return attributes.style ? { style: attributes.style } : {};
          },
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Link.configure({ openOnClick: false }),
      Underline,
      CustomBulletList,
      CustomOrderedList,
      ListItem,
    ],
    content: formdata || "",
    onUpdate: ({ editor }) => {
      handleQuillChange(editor.getHTML());
    },
    autofocus: false,
  });

  // useEffect(() => {
  //   if (editor && formdata !== undefined && formdata !== null) {
  //     if (formdata !== editor.getHTML()) {
  //       editor.commands.setContent(formdata);
  //     }
  //   }
  // }, [formdata, editor]);

  // if (!editor) return <div>Loading Editor...</div>;

  const applyBulletListStyle = (style) => {
    if (!editor) return;

    const { state, commands, view } = editor;
    const { selection } = state;
    const pos = selection.$from.pos;

    const listElement = view.domAtPos(pos).node.closest("ul, ol");

    if (listElement) {
      listElement.setAttribute("data-style", style);
      listElement.style.listStyleType = style;

      editor.commands.updateAttributes("bulletList", {
        "data-style": style,
        style: `list-style-type: ${style};`,
      });
    } else {
      editor.commands.toggleBulletList();

      setTimeout(() => {
        const newListElement = view.dom.querySelector("ul, ol");
        if (newListElement) {
          newListElement.setAttribute("data-style", style);
          newListElement.style.listStyleType = style;

          editor.commands.updateAttributes("bulletList", {
            "data-style": style,
            style: `list-style-type: ${style};`,
          });
        }
      }, 0);
    }
  };

  const isActive = (type, options = {}) => {
    return editor.isActive(type, options) ? "bg-black text-white" : "";
  };

  // Remove the autofocus useEffect since we don't want automatic focusing
  // Keep the content synchronization effect
  useEffect(() => {
    if (editor && formdata !== undefined && formdata !== null) {
      if (formdata !== editor.getHTML()) {
        editor.commands.setContent(formdata);
      }
    }
  }, [formdata, editor]);

  // Enhanced click handler
  const handleEditorClick = (e) => {
    if (!editor) return;

    // Only focus if clicking on the content area (not toolbar)
    const contentElement = document.querySelector(".mantine-editor-content");
    if (contentElement && contentElement.contains(e.target)) {
      editor.commands.focus();
    }
  };

  if (!editor) return <div>Loading Editor...</div>;

  return (
    <div
      onClick={handleEditorClick}
      style={{ cursor: "text" }}
      className="editor-wrapper"
    >
      <MantineRichTextEditor
        editor={editor}
        className="border border-gray-300 rounded-2xl p-2 shadow-md"
      >
        {/* Toolbar */}
        <MantineRichTextEditor.Toolbar className="flex flex-wrap gap-x-1 px-1 justify-center bg-gray-200 py-2 rounded-t-xl shadow-sm">
          {[
            MantineRichTextEditor.Bold,
            MantineRichTextEditor.Italic,
            MantineRichTextEditor.Underline,
            MantineRichTextEditor.Strikethrough,
            MantineRichTextEditor.ClearFormatting,
            MantineRichTextEditor.Code,
          ].map((Control, index) => (
            <Control
              key={index}
              className={`border p-4 rounded-md hover:bg-gray-300 transition ${isActive(
                "bold"
              )}`}
            />
          ))}

          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              size="xs"
              variant={
                editor.isActive("heading", { level }) ? "filled" : "default"
              }
              className={`border p-2 rounded-md ${isActive("heading", {
                level,
              })}`}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
            >
              H{level}
            </Button>
          ))}

          <div className="relative">
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <Button size="xs" className={`border p-2 rounded-md `}>
                  Un-ordered List
                </Button>
              </Menu.Target>
              <Menu.Dropdown className="absolute top-full left-4 px-4 z-50 bg-white shadow-md rounded-md flex flex-col">
                <Menu.Item
                  onClick={() => applyBulletListStyle("disc")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Default (•)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("square")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Square (▪)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("circle")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Circle (◦)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("dashed")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Dashed (-)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("arrow")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Arrow (→)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("checked")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Checked (✔)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>

          <div className="relative">
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <Button size="xs" className={`border p-2 rounded-md`}>
                  Ordered List
                </Button>
              </Menu.Target>
              <Menu.Dropdown className="absolute top-full left-4 px-4 z-50 bg-white shadow-md rounded-md flex flex-col">
                <Menu.Item
                  onClick={() => applyBulletListStyle("decimal")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Numbered (1, 2, 3)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("lower-alpha")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Lower Alpha (a, b, c)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("upper-alpha")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Upper Alpha (A, B, C)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("lower-roman")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Lower Roman (i, ii, iii)
                </Menu.Item>
                <Menu.Item
                  onClick={() => applyBulletListStyle("upper-roman")}
                  className="py-1 border-b hover:bg-gray-100 transition-all duration-300 text-left"
                >
                  Upper Roman (I, II, III)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>

          {/* Subscript & Superscript */}
          <MantineRichTextEditor.Subscript className="border p-2 rounded-md hover:bg-gray-300" />
          <MantineRichTextEditor.Superscript className="border p-2 rounded-md hover:bg-gray-300" />

          {/* Text Alignment */}
          {[
            MantineRichTextEditor.AlignLeft,
            MantineRichTextEditor.AlignCenter,
            MantineRichTextEditor.AlignJustify,
            MantineRichTextEditor.AlignRight,
          ].map((Control, index) => (
            <Control
              key={index}
              className={`border p-2 rounded-md hover:bg-gray-300 ${isActive(
                "textAlign"
              )}`}
            />
          ))}

          {/* Undo & Redo */}
          <MantineRichTextEditor.Undo className="border p-2 rounded-md hover:bg-gray-300" />
          <MantineRichTextEditor.Redo className="border p-2 rounded-md hover:bg-gray-300" />
        </MantineRichTextEditor.Toolbar>

        {/* Editor Content */}
        <MantineRichTextEditor.Content
          tabIndex={0}
          className="prose mantine-editor-content h-[30rem] overflow-auto"
        />
      </MantineRichTextEditor>
    </div>
  );
}
