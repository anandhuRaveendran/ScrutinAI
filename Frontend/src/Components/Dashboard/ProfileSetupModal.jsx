import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { User, X, Link as LinkIcon, CheckCircle } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ProfileSetupModal = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
    const { user, login } = useAuth();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Determines if modal should be shown (controlled or internal state)
    const showModal = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    const [formData, setFormData] = useState({
        avatar: "",
        firstName: "",
        lastName: "",
        role: "",
        location: "",
        skills: [],
        skillInput: "",
        certifications: [
            {
                title: "",
                issuer: "",
            },
        ],
        about: "",
        socialLinks: {
            twitter: "",
            github: "",
            linkedin: "",
            email: "",
        },
    });

    // Close logic
    const handleClose = () => {
        if (externalOnClose) {
            externalOnClose();
        } else {
            setInternalIsOpen(false);
        }
    };

    /* OPEN MODAL IF PROFILE NOT COMPLETED (Legacy/Auto Logic) */
    useEffect(() => {
        if (user && user.profileCompleted === false) {
            setInternalIsOpen(true);
        }
    }, [user]);

    /* POPULATE FORM WHEN MODAL OPENS */
    useEffect(() => {
        if (showModal && user) {
            setFormData({
                avatar: user.avatar || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                role: user.role || "",
                location: user.location || "",
                skills: user.skills || [],
                skillInput: "",
                certifications: user.certifications && user.certifications.length > 0
                    ? user.certifications
                    : [{ title: "", issuer: "" }],
                about: user.about || "",
                socialLinks: {
                    twitter: user.socialLinks?.twitter || "",
                    github: user.socialLinks?.github || "",
                    linkedin: user.socialLinks?.linkedin || "",
                    email: user.email || "",
                },
            });
        }
    }, [showModal, user]);

    /* INPUT HANDLING */
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("socialLinks.")) {
            const field = name.split(".")[1];
            setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, [field]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    /* AVATAR UPLOAD (BASE64) */
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, avatar: reader.result });
        };
        reader.readAsDataURL(file);
    };

    /* SKILLS */
    const handleAddSkill = (e) => {
        if (e.key === "Enter" && formData.skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(formData.skillInput.trim())) {
                setFormData({
                    ...formData,
                    skills: [...formData.skills, formData.skillInput.trim()],
                    skillInput: "",
                });
            }
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    /* CERTIFICATIONS */
    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [
                ...formData.certifications,
                { title: "", issuer: "" },
            ],
        });
    };

    const handleCertChange = (index, field, value) => {
        const updated = [...formData.certifications];
        updated[index][field] = value;
        setFormData({ ...formData, certifications: updated });
    };

    const removeCertification = (index) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index),
        });
    };

    /* VALIDATION */
    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.role &&
        formData.about &&
        formData.skills.length > 0;

    /* SUBMIT */
    const handleSubmit = async () => {
        if (!isFormValid) return;
        setLoading(true);

        try {
            const res = await axios.put(
                `${API_URL}/user/update-profile`,
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                login(res.data.user);
                handleClose();
            }
        } catch (err) {
            console.error("Profile update failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            {/* BACKDROP CLICK TO CLOSE */}
            <div className="absolute inset-0" onClick={handleClose}></div>

            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl text-white flex flex-col z-10">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-white/10 shrink-0 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {user?.profileCompleted ? "Edit Profile" : "Complete your profile"}
                        </h2>
                        <p className="text-xs text-gray-400">
                            {user?.profileCompleted ? "Update your details visible to others" : "A complete profile builds trust with teams"}
                        </p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-thin">

                    {/* LEFT COLUMN */}
                    <div className="space-y-5">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border border-white/10 overflow-hidden bg-gray-900 flex items-center justify-center relative group">
                                {formData.avatar ? (
                                    <img src={formData.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-semibold text-gray-500">
                                        {formData.firstName?.charAt(0) || <User />}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                    <span className="text-xs text-white">Change</span>
                                </div>
                            </div>
                            <label className="mt-2 text-xs text-blue-400 cursor-pointer hover:underline">
                                Upload avatar
                                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 ml-1">First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 ml-1">Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Role / Title</label>
                            <input name="role" value={formData.role} onChange={handleChange} placeholder="Smart Contract Auditor" className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="Berlin, Germany" className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Specialized in smart contract security, DeFi audits, and EVM vulnerabilities..."
                                className="input resize-none w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition"
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* SKILLS */}
                        <div>
                            <label className="text-xs text-gray-400">Skills (press Enter)</label>
                            <div className="mt-2 flex flex-wrap gap-2 border border-white/10 bg-white/5 rounded-lg p-3">
                                {formData.skills.map((skill) => (
                                    <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs rounded flex items-center gap-1 border border-blue-500/30">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="hover:text-white">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    value={formData.skillInput}
                                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                                    onKeyDown={handleAddSkill}
                                    placeholder="Add skills (e.g. Solidity, Hardhat)..."
                                    className="bg-transparent outline-none text-sm flex-grow placeholder:text-gray-600 text-white min-w-[120px]"
                                />
                            </div>
                        </div>

                        {/* CERTIFICATIONS */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs text-gray-400">Certifications</label>
                                <button
                                    onClick={addCertification}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                                >
                                    + Add New
                                </button>
                            </div>

                            {formData.certifications.map((cert, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                                >
                                    <input
                                        placeholder="Name (e.g. Certified Auditor)"
                                        value={cert.title}
                                        onChange={(e) =>
                                            handleCertChange(i, "title", e.target.value)
                                        }
                                        className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition"
                                    />

                                    <input
                                        placeholder="Issuer (e.g. ConsenSys)"
                                        value={cert.issuer}
                                        onChange={(e) =>
                                            handleCertChange(i, "issuer", e.target.value)
                                        }
                                        className="input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition"
                                    />

                                    {/* REMOVE BUTTON */}
                                    <button
                                        onClick={() => removeCertification(i)}
                                        className="
                                        p-2 rounded-md
                                        text-gray-400
                                        hover:text-red-400
                                        hover:bg-red-500/10
                                        transition
                                        "
                                        title="Remove certification"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>


                        {/* SOCIAL LINKS */}
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Social Links</label>
                            <div className="grid grid-cols-2 gap-4">
                                {["twitter", "github", "linkedin", "email"].map((key) => (
                                    <div key={key} className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition">
                                            <LinkIcon size={14} />
                                        </span>
                                        <input
                                            name={`socialLinks.${key}`}
                                            value={formData.socialLinks[key]}
                                            onChange={handleChange}
                                            placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                                            className="input w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-600 transition"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-end shrink-0 bg-[#0a0f1c] rounded-b-xl gap-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${isFormValid
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Saving..." : "Save Profile"}
                        <CheckCircle size={16} />
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default ProfileSetupModal;
