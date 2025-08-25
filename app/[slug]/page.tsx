import ClientStream from "./ClientStream";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ClientStream slug={slug} />;
}