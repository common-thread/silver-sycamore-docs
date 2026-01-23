"use client";

import { DocumentCanvas } from "@/components/document/DocumentCanvas";
import { HeroHeader, TwoColumnGrid, FeatureList } from "@/components/layouts/PageLayouts";
import Button from "@/components/ui/Button";

export default function DesignSystemPage() {
    return (
        <>
            {/* 1. Hero Layout Pattern */}
            <HeroHeader
                title="Silver Sycamore Design System"
                subtitle="The official visual language and layout patterns for the Staff Hub. Aesthetic: Quiet Productivity."
            />

            <DocumentCanvas>

                {/* 2. Typography Section */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">Typography</h2>
                        <span className="font-mono text-xs text-ink-muted">Playfair Display & DM Sans</span>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-baseline">
                            <span className="font-mono text-xs text-ink-muted">Display 4XL (H1)</span>
                            <h1 className="font-display text-4xl font-bold text-ink leading-tight">
                                The Quick Brown Fox
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-baseline">
                            <span className="font-mono text-xs text-ink-muted">Display 3XL (H2)</span>
                            <h2 className="font-display text-3xl font-semibold text-ink">
                                Quiet Productivity
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-baseline">
                            <span className="font-mono text-xs text-ink-muted">Display 2XL (H3)</span>
                            <h3 className="font-display text-2xl font-semibold text-ink">
                                Administrative Registry
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-baseline">
                            <span className="font-mono text-xs text-ink-muted">Body Text</span>
                            <p className="font-body text-base text-ink leading-relaxed max-w-prose">
                                Interfaces should feel like a well-organized registry or library, not a generic SaaS dashboard.
                                Use font weight, case, and family to denote hierarchy instead of colored boxes or heavy borders.
                                Hover states should be subtle rather than loud.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Color Palette */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">Color Palette</h2>
                        <span className="font-mono text-xs text-ink-muted">Warm Monochrome + Champagne</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-paper border border-border-subtle"></div>
                            <div className="font-mono text-xs text-ink-muted">bg-paper</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-paper-warm border border-border-subtle"></div>
                            <div className="font-mono text-xs text-ink-muted">bg-paper-warm</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-white border border-border-subtle shadow-sm"></div>
                            <div className="font-mono text-xs text-ink-muted">bg-white</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-champagne"></div>
                            <div className="font-mono text-xs text-ink-muted">bg-champagne</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-ink text-white flex items-center justify-center">Ink</div>
                            <div className="font-mono text-xs text-ink-muted">bg-ink</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-ink-mid text-white flex items-center justify-center">Mid</div>
                            <div className="font-mono text-xs text-ink-muted">bg-ink-mid</div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-md bg-ink-light text-white flex items-center justify-center">Light</div>
                            <div className="font-mono text-xs text-ink-muted">bg-ink-light</div>
                        </div>
                    </div>
                </section>

                {/* 4. Components */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">Components</h2>
                        <span className="font-mono text-xs text-ink-muted">Interactive Elements</span>
                    </div>

                    <div className="space-y-12">
                        {/* Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center">
                            <span className="font-mono text-xs text-ink-muted">Buttons</span>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary Action</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="ghost">Ghost Button</Button>
                                <Button variant="accent">Accent Button</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center">
                            <span className="font-mono text-xs text-ink-muted">Sizes</span>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="icon">
                                    <span className="text-lg">★</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Layout Patterns */}
                <section className="mb-20">
                    <div className="flex items-baseline justify-between border-b border-border-subtle pb-4 mb-8">
                        <h2 className="font-display text-2xl font-bold text-ink">Layout Patterns</h2>
                        <span className="font-mono text-xs text-ink-muted">Reusables from PageLayouts.tsx</span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-ink mb-6">Two Column Grid</h3>
                    <TwoColumnGrid
                        className="bg-paper-warm/20 p-8 -mx-8"
                        ratio="30/70"
                        left={
                            <div className="p-6 bg-white border border-border-subtle rounded-sm h-full flex items-center justify-center text-ink-muted italic">
                                Image or Sidebar Content
                            </div>
                        }
                        right={
                            <div className="space-y-4">
                                <h4 className="font-display font-medium text-xl">Editorial Content Block</h4>
                                <p className="text-ink-light text-sm leading-relaxed">
                                    This pattern is used for high-level category pages or "Pricing vs Features" comparisons.
                                    It splits content editorial-style, maintaining balance.
                                </p>
                                <p className="text-ink-light text-sm leading-relaxed">
                                    On mobile devices, this grid collapses into a single vertical column to maintain readability.
                                </p>
                            </div>
                        }
                    />

                    <h3 className="font-display text-lg font-semibold text-ink mb-6 mt-12">Feature List</h3>
                    <FeatureList
                        items={[
                            { title: "Standardized", description: "Consistent spacing and typography tokens.", icon: <span className="text-2xl">📐</span> },
                            { title: "Responsive", description: "Adapts to extensive mobile use cases.", icon: <span className="text-2xl">📱</span> },
                            { title: "Accessible", description: "High contrast for long-form reading.", icon: <span className="text-2xl">👁️</span> },
                        ]}
                    />
                </section>

            </DocumentCanvas>
        </>
    );
}
