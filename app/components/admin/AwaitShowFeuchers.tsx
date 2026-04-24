export default async function AwaitShowFeuchers() {
  const response = await fetch("http://localhost:3000/api/property-fields");
  const data = await response.json();

  return (
    <>
      {data.map((field: any) => (
        <div key={field.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h2>{field.title}</h2>
          <p>نوع: {field.type}</p>

          {field.options.length > 0 ? (
            <ul>
              {field.options.map((opt: any) => (
                <li key={opt.id}>{opt.label} ({opt.value})</li>
              ))}
            </ul>
          ) : (
            <p>گزینه‌ای ندارد</p>
          )}
        </div>
      ))}
    </>
  )
}