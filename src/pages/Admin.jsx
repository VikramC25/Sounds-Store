import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const getUploadUrl = useMutation(api.admin.getUploadUrl);
  const createPack = useMutation(api.admin.createPack);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [snippets, setSnippets] = useState([]);
  const [snippetPreviews, setSnippetPreviews] = useState([]);

  const [packTxt, setPackTxt] = useState(null);

  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingSnippets, setIsDraggingSnippets] = useState(false);
  const [isDraggingTxt, setIsDraggingTxt] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const zone = (drag) =>
    `border-2 rounded-lg p-6 text-center cursor-pointer transition ${
      drag ? "border-black bg-gray-100" : "border-gray-300 bg-gray-50"
    }`;

  // -------------------- FILE HANDLERS ---------------------

  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleSnippetsUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSnippets(files);
    setSnippetPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  // Upload ANY file to Convex
  async function uploadFile(file) {
    const url = await getUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      body: file,
    });

    const json = await res.json();
    return json.storageId;
  }

  // -------------------- SUBMIT PACK ---------------------

  async function submitPack() {
    if (!title || !description || !price || !cover || !packTxt) {
      alert("Please fill all fields and upload all required files.");
      return;
    }

    setLoading(true);
    setStatus("Uploading files...");

    try {
      // Slug (clean)
      const slug = title.toLowerCase().replace(/\s+/g, "-");

      // Upload cover
      const coverId = await uploadFile(cover);

      // Upload snippets parallel (much faster)
      const snippetIds = await Promise.all(
        snippets.map((file) => uploadFile(file))
      );

      // Upload TXT file
      const fullPackFileId = await uploadFile(packTxt);

      setStatus("Saving pack...");

      // Store in DB
      const result = await createPack({
        title,
        slug,
        description,
        price: Number(price),
        coverFileId: coverId,
        snippets: snippetIds,
        fullPackFileId,
        tags: [],
        createdAt: Date.now(),
      });

      setStatus("Pack Created Successfully! Redirecting...");

      setTimeout(() => {
        navigate(`/pack/${result.slug}`);
      }, 800);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check the console.");
    }

    setLoading(false);
  }

  // -------------------- UI ------------------------

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">Create New Pack</h1>

      {/* TITLE */}
      <label className="font-semibold">Pack Title</label>
      <input
        className="border p-3 w-full mb-6 rounded-md"
        placeholder="Pack Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <label className="font-semibold">Description</label>
      <textarea
        className="border p-3 w-full mb-6 rounded-md"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* PRICE */}
      <label className="font-semibold">Price (In Dollars)</label>
      <input
        type="number"
        className="border p-3 w-full mb-10 rounded-md"
        placeholder="5"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* COVER */}
      <div
        className={zone(isDraggingCover)}
        onClick={() => document.getElementById("coverInput").click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDraggingCover(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDraggingCover(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingCover(false);
          const file = e.dataTransfer.files[0];
          handleCoverUpload({ target: { files: [file] } });
        }}
      >
        <p className="font-semibold">
          {cover ? "Replace Cover Image" : "Upload Cover Image"}
        </p>
        {coverPreview && (
          <img
            src={coverPreview}
            className="w-32 h-32 object-cover rounded-xl mx-auto mt-4"
          />
        )}
      </div>
      <input
        id="coverInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />

      {/* SNIPPETS */}
      <div
        className={`${zone(isDraggingSnippets)} mt-8`}
        onClick={() => document.getElementById("snippetsInput").click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDraggingSnippets(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDraggingSnippets(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingSnippets(false);
          const files = Array.from(e.dataTransfer.files);
          handleSnippetsUpload({ target: { files } });
        }}
      >
        <p className="font-semibold">
          {snippets.length ? "Replace Snippets" : "Upload Snippet MP3s"}
        </p>

        {snippetPreviews.length > 0 && (
          <div className="mt-4 space-y-3">
            {snippetPreviews.map((url, i) => (
              <audio key={i} controls src={url} className="w-full" />
            ))}
          </div>
        )}
      </div>
      <input
        id="snippetsInput"
        type="file"
        accept="audio/mpeg"
        multiple
        className="hidden"
        onChange={handleSnippetsUpload}
      />

      {/* TXT FILE */}
      <div
        className={`${zone(isDraggingTxt)} mt-8`}
        onClick={() => document.getElementById("txtInput").click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDraggingTxt(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDraggingTxt(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingTxt(false);
          const file = e.dataTransfer.files[0];
          setPackTxt(file);
        }}
      >
        <p className="font-semibold">
          {packTxt ? "Replace TXT File" : "Upload TXT File (ZIP link)"}
        </p>

        {packTxt && (
          <p className="mt-4 text-gray-700 text-sm">{packTxt.name}</p>
        )}
      </div>
      <input
        id="txtInput"
        type="file"
        accept=".txt"
        className="hidden"
        onChange={(e) => setPackTxt(e.target.files[0])}
      />

      {/* SUBMIT */}
      <button
        onClick={submitPack}
        disabled={loading}
        className={`mt-10 w-full bg-black text-white py-3 rounded-lg text-lg ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? "Uploading..." : "Create Pack"}
      </button>

      {status && <p className="mt-6 text-center text-gray-700">{status}</p>}
    </div>
  );
}
