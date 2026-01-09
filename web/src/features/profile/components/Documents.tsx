

export default function Documents() {
  const docs = [
    { name: "AminaKhalid_CV.pdf", size: "412 KB", date: "2 days ago" },
    { name: "ThermalStudy_SOW.docx", size: "96 KB", date: "1 week ago" },
  ];
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl text-gray-900 mb-4">Documents</h1>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600 mb-6">
          <p className="mb-2">Drag & drop files here, or click to upload</p>
          <p className="text-sm text-gray-500">PDF, DOCX, PNG up to 10MB</p>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">File</th>
                <th className="p-3">Size</th>
                <th className="p-3">Uploaded</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {docs.map((d) => (
                <tr key={d.name}>
                  <td className="p-3 text-gray-900">{d.name}</td>
                  <td className="p-3 text-gray-700">{d.size}</td>
                  <td className="p-3 text-gray-700">{d.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Download
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
