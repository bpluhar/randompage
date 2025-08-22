import ClientStream from "./ClientStream";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <ClientStream slug={slug} />;
}