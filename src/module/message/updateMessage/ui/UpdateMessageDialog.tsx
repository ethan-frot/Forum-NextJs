'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Edit2, MessageSquare } from 'lucide-react';
import { CustomModal } from '@/components/app/common/CustomModal';
import { GradientButton } from '@/components/app/common/GradientButton';
import { IconTextarea } from '@/components/app/common/IconTextarea';
import { updateMessage } from '@/services/message/message.service';

interface UpdateMessageDialogProps {
  messageId: string;
  currentContent: string;
  conversationId: string;
}

interface FormData {
  content: string;
}

export function UpdateMessageDialog({
  messageId,
  currentContent,
  conversationId,
}: UpdateMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      content: currentContent,
    },
  });

  useEffect(() => {
    reset({ content: currentContent });
  }, [currentContent, reset]);

  const mutation = useMutation({
    mutationFn: updateMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
      toast.success('Message modifié avec succès');
      setIsOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleClose = () => {
    reset({ content: currentContent });
    setIsOpen(false);
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      messageId,
      content: data.content,
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer text-white/70 hover:text-white text-sm"
        aria-label="Modifier le message"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>

      <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="700px">
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Edit2 className="h-6 w-6 text-blue-400" />
              Modifier le message
            </h2>
            <p className="text-white/70 text-base">
              Modifiez le contenu de votre message.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <IconTextarea
              id="content"
              label="Contenu du message"
              icon={MessageSquare}
              placeholder="Votre message..."
              rows={8}
              error={errors.content?.message}
              helperText="1 à 2000 caractères"
              disabled={mutation.isPending}
              {...register('content', {
                required: 'Le contenu est requis',
                minLength: {
                  value: 1,
                  message: 'Le contenu doit contenir au moins 1 caractère',
                },
                maxLength: {
                  value: 2000,
                  message: 'Le contenu ne peut pas dépasser 2000 caractères',
                },
              })}
            />

            <div className="pt-4 border-t border-white/10">
              <GradientButton
                type="submit"
                isLoading={mutation.isPending}
                loadingText="Modification..."
                className="w-full"
              >
                Modifier le message
              </GradientButton>
            </div>
          </form>
        </div>
      </CustomModal>
    </>
  );
}
