import React, { useState } from "react";
import {
    Offcanvas,
    Button,
    Form,
    ListGroup,
    InputGroup,
} from "react-bootstrap";
import {
    FiPaperclip,
    FiThumbsUp,
    FiSend,
    FiEdit,
    FiTrash2,
    FiMessageCircle,
    FiAtSign,
} from "react-icons/fi";

const mockMentions = ["Alice", "Bob", "Charlie", "Hardik"];

const CommentSidebar = ({ show, handleClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [showMentionList, setShowMentionList] = useState(false);
    const [replyFormOpenId, setReplyFormOpenId] = useState(null);

    const handleCommentSubmit = (parentId = null) => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            text: newComment,
            time: new Date().toLocaleString(),
            attachments,
            replies: [],
            parentId,
        };

        if (parentId) {
            setComments(prev =>
                prev.map(c =>
                    c.id === parentId ? { ...c, replies: [...c.replies, comment] } : c
                )
            );
        } else {
            setComments(prev => [...prev, comment]);
        }

        setNewComment("");
        setAttachments([]);
        setShowMentionList(false);
        setReplyFormOpenId(null);
    };

    const handleFileChange = e => {
        const files = Array.from(e.target.files);
        const preview = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setAttachments(preview);
    };

    const handleDelete = id => {
        setComments(prev => prev.filter(c => c.id !== id));
    };

    const handleEdit = (id, newText) => {
        setComments(prev =>
            prev.map(c => (c.id === id ? { ...c, text: newText } : c))
        );
    };

    const initials = getInitials(name);

    function getInitials(name) {
        if (!name) return "";
        const words = name.trim().split(/\s+/); // Split by any amount of whitespace
        const firstInitial = words[0]?.[0] || "";
        const secondInitial = words[1]?.[0] || "";
        return (firstInitial + secondInitial).toUpperCase();
    }

    const renderComment = comment => (
        <ListGroup.Item key={comment.id} className="mb-2">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <div className="user-image-box"
                    style={{
                        backgroundImage: 'url("https://i.pravatar.cc/150?img=4")',
                    }}
                    title={name}
                >
                </div>

                <div className="ms-3">
                    <p className="mb-0"> UserName </p>
                    <small className="text-muted">{comment.time}</small>
                </div>
                </div>
                

                <div>
                    <Button
                        variant="link"
                        className="p-1"
                        onClick={() =>
                            setNewComment(comment.text) || handleDelete(comment.id)
                        }
                    >
                        <FiTrash2 />
                    </Button>
                    <Button
                        variant="link"
                        className="p-1"
                        onClick={() => {
                            setNewComment(comment.text);
                            handleDelete(comment.id);
                        }}
                    >
                        <FiEdit />
                    </Button>
                </div>
            </div>
            <div className="mt-1">{comment.text}</div>

            {comment.attachments.length > 0 && (
                <div className="mt-2">
                    {comment.attachments.map(file => (
                        <img
                            key={file.name}
                            src={file.url}
                            alt={file.name}
                            width="80"
                            className="me-2 rounded"
                        />
                    ))}
                </div>
            )}

            <div className="d-flex gap-3 mt-2">
                <Button variant="link" size="sm" className="p-0 text-primary">
                    <FiThumbsUp /> Like
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-primary"
                    onClick={() =>
                        setReplyFormOpenId(replyFormOpenId === comment.id ? null : comment.id)
                    }
                >
                    <FiMessageCircle /> Reply
                </Button>
            </div>

            {replyFormOpenId === comment.id && (
                <div className="mt-2 ms-3">
                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={newComment}
                            placeholder="Write a reply..."
                            onChange={e => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            size="sm"
                            variant="light"
                            onClick={() => setShowMentionList(true)}
                        >
                            <FiAtSign /> Mention
                        </Button>
                        <Form.Label className="mb-0">
                            <FiPaperclip />
                            <Form.Control
                                type="file"
                                hidden
                                multiple
                                onChange={handleFileChange}
                            />
                        </Form.Label>
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleCommentSubmit(comment.id)}
                        >
                            <FiSend />
                        </Button>
                    </div>
                </div>
            )}

            {comment.replies.length > 0 && (
                <ListGroup className="mt-2 ms-3">
                    {comment.replies.map(reply => renderComment(reply))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Comments</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup className="mb-4">
                    {comments.map(comment => renderComment(comment))}
                </ListGroup>



                <div className="comment-input-area border rounded p-3">
                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newComment}
                            placeholder="Write an update and mention others with @"
                            onChange={e => setNewComment(e.target.value)}
                        />
                    </Form.Group>

                    {attachments.length > 0 && (
                        <div className="mb-2 d-flex flex-wrap gap-2">
                            {attachments.map(file => (
                                <img
                                    key={file.name}
                                    src={file.url}
                                    alt={file.name}
                                    width="80"
                                    className="rounded"
                                />
                            ))}
                        </div>
                    )}

                    {showMentionList && (
                        <ListGroup className="mb-2 shadow-sm" style={{ maxHeight: 150, overflowY: "auto" }}>
                            {mockMentions.map((mention, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    action
                                    onClick={() => {
                                        setNewComment(prev => prev + `@${mention} `);
                                        setShowMentionList(false);
                                    }}
                                >
                                    @{mention}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    <div className="d-flex align-items-center gap-3">
                        <Button
                            size="sm"
                            variant="light"
                            onClick={() => setShowMentionList(true)}
                        >
                            <FiAtSign /> Mention
                        </Button>

                        <Form.Label className="mb-0">
                            <FiPaperclip />
                            <Form.Control
                                type="file"
                                hidden
                                multiple
                                onChange={handleFileChange}
                            />
                        </Form.Label>

                        <Button size="sm" variant="primary" onClick={() => handleCommentSubmit()}>
                            <FiSend />
                        </Button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CommentSidebar;
