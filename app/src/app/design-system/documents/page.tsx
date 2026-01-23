"use client";

import { DocumentCanvas } from "@/components/document/DocumentCanvas";

export default function DocumentStyleGuidePage() {
    return (
        <div className="bg-paper-warm min-h-screen p-8">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="font-display text-3xl font-bold text-ink mb-2">Document Style Guide</h1>
                <p className="text-ink-light">
                    This is the "Functional Clarity" style for actual documentation content.
                    It should look like a word processor, not a wedding invitation.
                </p>
            </div>

            {/* The Demo Canvas */}
            <DocumentCanvas>
                <div className="document-content">
                    <h1>Document Title (H1)</h1>
                    <p>
                        This is a standard paragraph in the document editor. The goal is <strong>high legibility</strong> and clear information density.
                        It uses <a href="#">standard blue links</a> because they are universally understood.
                    </p>

                    <h2>Section Header (H2)</h2>
                    <p>
                        The H2 header has a subtle underline to create a clear section break, similar to GitHub READMEs or Notion.
                    </p>

                    <ul>
                        <li>This is an unordered list item.</li>
                        <li>It has standard bullets.</li>
                        <li>Nested items:
                            <ul>
                                <li>Look like this.</li>
                                <li>Clean and indented.</li>
                            </ul>
                        </li>
                    </ul>

                    <h3>Subsection (H3)</h3>
                    <p>
                        H3 headers are smaller but still bold. They do not have underlines.
                    </p>

                    <ol>
                        <li>Ordered list item one.</li>
                        <li>Ordered list item two.</li>
                        <li>Ordered list item three.</li>
                    </ol>

                    <h4>Minor Heading (H4)</h4>
                    <blockquote>
                        "This is a blockquote. It stands out with a simple gray border, indicating quoted text or important notes."
                    </blockquote>

                    <h2>Data Tables</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Typography</td>
                                <td>Sans-Serif</td>
                                <td>Optimized for screen reading via Inter/System fonts.</td>
                            </tr>
                            <tr>
                                <td>Colors</td>
                                <td>Grayscale</td>
                                <td>High contrast #111 text on white.</td>
                            </tr>
                            <tr>
                                <td>Links</td>
                                <td>Blue (#2563eb)</td>
                                <td>Standard web affordance.</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Code Blocks</h2>
                    <pre><code>
                        {`function example() {
  console.log("This is a functional code block");
  return true;
}`}
                    </code></pre>

                    <h2>Task Lists</h2>
                    <ul data-type="taskList">
                        <li data-type="taskItem"><input type="checkbox" checked readOnly /> Completed task item</li>
                        <li data-type="taskItem"><input type="checkbox" /> Pending task item</li>
                        <li data-type="taskItem"><input type="checkbox" /> Another todo</li>
                    </ul>

                </div>
            </DocumentCanvas>
        </div>
    );
}
