import CodeEditor from '../../src/components/CodeEditor';

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `Room ${id} — Collaborative Coding`,
        description: `Join the collaborative coding session ${id} on SyncMyCode. Edit code in real-time with other developers.`,
        robots: { index: false, follow: false },
    };
}

export default async function CodeEditorPage({ params }) {
    const { id } = await params;
    return <CodeEditor id={id} />;
}
