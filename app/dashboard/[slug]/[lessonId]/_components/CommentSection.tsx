"use client";

import { useState, useTransition } from "react";
import { LessonComment, LessonCommentReply } from "@/app/data/course/get-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { postComment, editComment, deleteComment } from "./comment-actions";
import { toast } from "sonner";
import { Loader2, Reply, MessageSquare, Edit2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentSectionProps {
    lessonId: string;
    courseSlug: string;
    comments: LessonComment[];
    currentUserId?: string;
}

export function CommentSection({ lessonId, courseSlug, comments = [], currentUserId }: CommentSectionProps) {
    const [newCommentText, setNewCommentText] = useState("");
    const [pending, startTransition] = useTransition();

    function onSubmit() {
        if (!newCommentText.trim()) return;

        startTransition(async () => {
            const result = await postComment(lessonId, courseSlug, newCommentText);

            if (result.status === "success") {
                toast.success(result.message);
                setNewCommentText("");
            } else {
                toast.error(result.message);
            }
        });
    }

    return (
        <div className="pt-8 border-t mt-8">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Discussion</h2>
            </div>

            {/* New Comment Form */}
            <div className="mb-8 md:mb-10 p-3 md:p-4 bg-muted/50 rounded-xl border-2 border-border">
                <h3 className="text-sm font-medium mb-3">Add a comment</h3>
                <div className="flex flex-col gap-3">
                    <Textarea
                        placeholder="What are your thoughts on this lesson?"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="min-h-[100px] resize-y bg-background font-serif border-2"
                        disabled={pending}
                    />
                    <div className="flex justify-end">
                        <Button onClick={onSubmit} disabled={pending || !newCommentText.trim()}>
                            {pending ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
                            Post Comment
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                        No comments yet. Be the first to start the discussion!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            lessonId={lessonId}
                            courseSlug={courseSlug}
                            currentUserId={currentUserId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    lessonId,
    courseSlug,
    currentUserId,
}: {
    comment: LessonComment;
    lessonId: string;
    courseSlug: string;
    currentUserId?: string;
}) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    function onReplySubmit() {
        if (!replyText.trim()) return;

        startTransition(async () => {
            const result = await postComment(lessonId, courseSlug, replyText, comment.id);

            if (result.status === "success") {
                toast.success("Reply posted successfully");
                setReplyText("");
                setIsReplying(false);
            } else {
                toast.error(result.message);
            }
        });
    }

    function onEditSubmit() {
        if (!editText.trim()) return;

        startTransition(async () => {
            const result = await editComment(comment.id, editText, courseSlug, lessonId);

            if (result.status === "success") {
                toast.success(result.message);
                setIsEditing(false);
            } else {
                toast.error(result.message);
            }
        });
    }

    function onDeleteConfirm() {
        startTransition(async () => {
            const result = await deleteComment(comment.id, courseSlug, lessonId);
            if (result.status === "success") {
                toast.success(result.message);
                setDeleteOpen(false);
            } else {
                toast.error(result.message);
            }
        });
    }

    const isOwner = currentUserId === comment.userId;
    const canEdit = isOwner && (Date.now() - new Date(comment.createdAt).getTime()) < 60 * 60 * 1000;
    const isEdited = new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000;

    return (
        <div className="flex flex-col gap-3 md:gap-4">
            {/* Main Comment */}
            <div className="flex gap-3 md:gap-4">
                <Avatar className="size-8 md:size-10 shrink-0 border border-border">
                    <AvatarImage src={comment.user.image || ""} />
                    <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 md:space-y-2">
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span className="font-semibold text-sm">{comment.user.name}</span>
                        {comment.user.role === "admin" ? (
                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Admin</span>
                        ) : (
                            <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">Student</span>
                        )}
                        <span className="text-xs text-muted-foreground font-serif">
                            {formatRelativeTime(comment.createdAt)}
                            {isEdited && " (edited)"}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-2 mt-2">
                            <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="min-h-[80px] resize-y text-sm font-serif border-2"
                                disabled={pending}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditText(comment.text);
                                    }}
                                    disabled={pending}
                                >
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={onEditSubmit} disabled={pending || !editText.trim()}>
                                    {pending ? <Loader2 className="size-3 mr-2 animate-spin" /> : null}
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {comment.text}
                        </p>
                    )}

                    {!isEditing && (
                        <div className="flex items-center gap-4 pt-1">
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Reply className="size-3" />
                                Reply
                            </button>
                            {isOwner && (
                                <>
                                    {canEdit && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            <Edit2 className="size-3" />
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setDeleteOpen(true)}
                                        className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 className="size-3" />
                                        Delete
                                    </button>

                                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your comment.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                                                <Button onClick={onDeleteConfirm} disabled={pending} variant="destructive">
                                                    {pending ? <Loader2 className="size-3 mr-2 animate-spin" /> : null}
                                                    {pending ? "Deleting..." : "Delete"}
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Form */}
            {isReplying && (
                <div className="ml-11 md:ml-14 flex flex-col gap-3">
                    <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[80px] resize-y text-sm bg-muted/30 font-serif border-2"
                        disabled={pending}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReplying(false)}
                            disabled={pending}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={onReplySubmit} disabled={pending || !replyText.trim()}>
                            {pending ? <Loader2 className="size-3 mr-2 animate-spin" /> : null}
                            Reply
                        </Button>
                    </div>
                </div>
            )}

            {/* Replies List */}
            {comment.replies.length > 0 && (
                <div className="ml-11 md:ml-14 flex flex-col gap-3 md:gap-4 mt-2 border-l-2 border-border/50 pl-3 md:pl-4">
                    {comment.replies.map((reply: LessonCommentReply) => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            lessonId={lessonId}
                            courseSlug={courseSlug}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ReplyItem({
    reply,
    lessonId,
    courseSlug,
    currentUserId,
}: {
    reply: LessonCommentReply;
    lessonId: string;
    courseSlug: string;
    currentUserId?: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(reply.text);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    function onEditSubmit() {
        if (!editText.trim()) return;

        startTransition(async () => {
            const result = await editComment(reply.id, editText, courseSlug, lessonId);

            if (result.status === "success") {
                toast.success(result.message);
                setIsEditing(false);
            } else {
                toast.error(result.message);
            }
        });
    }

    function onDeleteConfirm() {
        startTransition(async () => {
            const result = await deleteComment(reply.id, courseSlug, lessonId);
            if (result.status === "success") {
                toast.success(result.message);
                setDeleteOpen(false);
            } else {
                toast.error(result.message);
            }
        });
    }

    const isOwner = currentUserId === reply.userId;
    const canEdit = isOwner && (Date.now() - new Date(reply.createdAt).getTime()) < 60 * 60 * 1000;
    const isEdited = new Date(reply.updatedAt).getTime() - new Date(reply.createdAt).getTime() > 1000;

    return (
        <div className="flex gap-2 md:gap-3">
            <Avatar className="size-6 md:size-8 shrink-0 border border-border">
                <AvatarImage src={reply.user.image || ""} />
                <AvatarFallback>{reply.user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 md:space-y-2">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                    <span className="font-semibold text-sm">{reply.user.name}</span>
                    {reply.user.role === "admin" ? (
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Admin</span>
                    ) : (
                        <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">Student</span>
                    )}
                    <span className="text-xs text-muted-foreground font-serif">
                        {formatRelativeTime(reply.createdAt)}
                        {isEdited && " (edited)"}
                    </span>
                </div>
                
                {isEditing ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[60px] resize-y text-sm font-serif border-2"
                            disabled={pending}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(reply.text);
                                }}
                                disabled={pending}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={onEditSubmit} disabled={pending || !editText.trim()}>
                                {pending ? <Loader2 className="size-3 mr-2 animate-spin" /> : null}
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {reply.text}
                    </p>
                )}

                {!isEditing && isOwner && (
                    <div className="flex items-center gap-4 pt-1">
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Edit2 className="size-3" />
                                Edit
                            </button>
                        )}
                        <button
                            onClick={() => setDeleteOpen(true)}
                            className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="size-3" />
                            Delete
                        </button>

                        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your reply.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                                    <Button onClick={onDeleteConfirm} disabled={pending} variant="destructive">
                                        {pending ? <Loader2 className="size-3 mr-2 animate-spin" /> : null}
                                        {pending ? "Deleting..." : "Delete"}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatRelativeTime(date: Date) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
    if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
    if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
    if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
    return rtf.format(-Math.floor(diff / 31536000), "year");
}
