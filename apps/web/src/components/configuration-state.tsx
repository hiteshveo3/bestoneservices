export function ConfigurationState({ title = "Not connected yet", detail }: { title?: string; detail: string }) { return <section className="panel"><h2>{title}</h2><p>{detail}</p></section>; }
