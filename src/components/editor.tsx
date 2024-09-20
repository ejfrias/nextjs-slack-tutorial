import { cn } from '@/lib/utils';
import { ImageIcon, Smile } from 'lucide-react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import { Hint } from './hint';
import { Button } from './ui/button';

interface EditorValueProps {
  image?: File | null;
  body: string;
}

interface EditorProps {
  variant?: 'create' | 'update';
  onSubmit: ({ image, body }: EditorValueProps) => void;
  onCancel?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  disabled = false,
  placeholder = 'Start typing...',
  defaultValue = [],
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState<string>('');
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                return;
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarEl = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarEl) {
      toolbarEl.classList.toggle('hidden');
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              disabled={disabled}
              onClick={toggleToolbar}
              size="iconSm"
              variant="ghost"
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              onClick={() => {}}
              size="iconSm"
              variant="ghost"
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                onClick={() => {}}
                size="iconSm"
                variant="ghost"
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'create' && (
            <Hint label="Send">
              <Button
                className={cn(
                  'ml-auto',
                  isEmpty
                    ? 'bg-white hover:bg-white text-muted-foreground'
                    : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                )}
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="iconSm"
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                disabled={disabled}
                onClick={onCancel}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="sm"
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 text-[12px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Enter</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
