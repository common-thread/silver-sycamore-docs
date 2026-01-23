"use client";

import { DocumentCanvas } from "@/components/document/DocumentCanvas";
import { HeroHeader, TwoColumnGrid, FeatureList } from "@/components/layouts/PageLayouts";

export default function LayoutPatternsPage() {
    return (
        <div className="bg-paper-warm min-h-screen">
            <HeroHeader
                title="Layout Patterns"
                subtitle="Standardized page structures for consistent information architecture."
            />

            <DocumentCanvas>
                <div className="prose mb-12">
                    <p className="lead">
                        Consistency minimizes cognitive load. We use three primary layout structures across the application.
                        Each has a specific purpose and should not be used interchangeably.
                    </p>
                </div>

                {/* Pattern 1: Document View */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">1. Document View</h2>
                        <span className="font-mono text-xs text-ink-muted">DocumentCanvas.tsx</span>
                    </div>

                    <TwoColumnGrid
                        ratio="30/70"
                        left={
                            <div className="h-64 bg-white border border-border-subtle rounded-md shadow-sm flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                <div className="absolute top-0 w-full h-12 bg-paper-warm border-b border-border-subtle/50"></div>
                                <div className="absolute top-16 w-3/4 h-4 bg-ink-light/10 rounded"></div>
                                <div className="absolute top-24 w-full h-32 px-4 space-y-2">
                                    <div className="w-full h-2 bg-ink-light/5 rounded"></div>
                                    <div className="w-full h-2 bg-ink-light/5 rounded"></div>
                                    <div className="w-5/6 h-2 bg-ink-light/5 rounded"></div>
                                </div>
                            </div>
                        }
                        right={
                            <div>
                                <h3 className="font-bold text-ink mb-2">The "Paper" Metaphor</h3>
                                <p className="text-ink-light text-sm mb-4">
                                    Used for high-density reading content (Docs, Guides, Contracts).
                                    It limits line length to 65-75 characters for optimal readability and centers content on a "page" background.
                                </p>
                                <ul className="text-sm text-ink-light list-disc pl-5 space-y-1">
                                    <li>Max-width: 800px (approx)</li>
                                    <li>Background: White sheet on Warm Desktop</li>
                                    <li>Typography: Serif headers, Sans-Serif body</li>
                                </ul>
                            </div>
                        }
                    />
                </section>

                {/* Pattern 2: Dashboard / Directory */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">2. Directory View</h2>
                        <span className="font-mono text-xs text-ink-muted">PageLayouts.tsx (TwoColumnGrid)</span>
                    </div>

                    <TwoColumnGrid
                        ratio="30/70"
                        left={
                            <div className="h-64 bg-paper-warm border border-border-subtle rounded-md flex p-4 gap-4">
                                <div className="w-1/3 bg-white h-full rounded border border-border-subtle/50"></div>
                                <div className="w-2/3 space-y-2">
                                    <div className="h-20 bg-white rounded border border-border-subtle/50"></div>
                                    <div className="h-20 bg-white rounded border border-border-subtle/50"></div>
                                </div>
                            </div>
                        }
                        right={
                            <div>
                                <h3 className="font-bold text-ink mb-2">Split Context</h3>
                                <p className="text-ink-light text-sm mb-4">
                                    Used for navigation hubs (Brand, Services). Left column context (Sidebar/Image) vs Right column Content (Grids/Lists).
                                </p>
                                <ul className="text-sm text-ink-light list-disc pl-5 space-y-1">
                                    <li>Ratio: 30/70 or 40/60</li>
                                    <li>Mobile: Stacks vertically</li>
                                    <li>Usage: Top-level landing pages</li>
                                </ul>
                            </div>
                        }
                    />
                </section>

                {/* Pattern 3: Feature Grid */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">3. Feature List</h2>
                        <span className="font-mono text-xs text-ink-muted">PageLayouts.tsx (FeatureList)</span>
                    </div>

                    <FeatureList
                        items={[
                            { title: "Scannable", description: "Icon + Title + Description format.", icon: <span>1</span> },
                            { title: "Modular", description: "Works within TwoColumnGrid or standalone.", icon: <span>2</span> },
                            { title: "Actionable", description: "Clear entry points for deeper content.", icon: <span>3</span> },
                        ]}
                    />
                </section>

            </DocumentCanvas>
        </div>
    );
}
