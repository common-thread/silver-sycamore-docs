"use client";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "@/components/brand/brand.module.css";
import { LogoIcon } from "@/components/Logo";

export default function StaffHubPage() {
    return (
        <div className={styles.page}>
            {/* Standardized Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroLogo} style={{ width: 'auto' }}>
                        {/* Optional: Visual identifier for Staff Hub? Using generic logo for now */}
                        <div className="bg-paper border border-border rounded-lg p-4 shadow-sm">
                            <LogoIcon size="md" />
                        </div>
                    </div>
                    <div className={styles.heroContent}>
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <Breadcrumb />
                        </div>
                        <h1 className={styles.heroTitle}>Staff Hub Identity</h1>
                        <p className={styles.heroSubtitle}>
                            The internal operating system for Silver Sycamore. Optimized for quiet productivity and information density.
                        </p>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                {/* Buttons Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Action Elements</span>
                        <h2 className={styles.sectionTitle}>Buttons</h2>
                        <p className={styles.sectionDescription}>
                            Primary actions use the default button style. Secondary and Ghost variants reduce visual noise for repetitive actions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-display text-lg font-bold text-ink mb-4">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="accent">Accent</Button>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary" disabled>Disabled</Button>
                                <Button variant="secondary" disabled>Disabled</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-display text-lg font-bold text-ink mb-4">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon" aria-label="Settings">⚙️</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Badges Section */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Status Indicators</span>
                        <h2 className={styles.sectionTitle}>Badges</h2>
                        <p className={styles.sectionDescription}>
                            Use badges to communicate state, category, or importance. The dot variant is preferred for listing views.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-display text-lg font-bold text-ink mb-4">Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="error">Error</Badge>
                                <Badge variant="info">Info</Badge>
                                <Badge variant="accent">Accent</Badge>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-display text-lg font-bold text-ink mb-4">With Dot</h3>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default" dot>Default</Badge>
                                <Badge variant="success" dot>Success</Badge>
                                <Badge variant="warning" dot>Warning</Badge>
                                <Badge variant="error" dot>Error</Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Inputs Section */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Data Entry</span>
                        <h2 className={styles.sectionTitle}>Inputs</h2>
                        <p className={styles.sectionDescription}>
                            Standard form controls. Ensure all inputs have visible labels and placeholder text.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Input
                                label="Standard Input"
                                placeholder="Enter text..."
                                hint="This is a helper text"
                            />
                            <Input
                                label="Error State"
                                placeholder="Enter text..."
                                error="This field is required"
                                defaultValue="Invalid input"
                            />
                        </div>
                        <div className="space-y-6">
                            <Input
                                label="Filled Variant"
                                variant="filled"
                                placeholder="Enter text..."
                            />
                            <Input
                                label="Disabled State"
                                disabled
                                placeholder="Cannot type here"
                            />
                        </div>
                    </div>
                </section>

                {/* Select Section */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Option Picking</span>
                        <h2 className={styles.sectionTitle}>Select</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Select
                                label="Standard Select"
                                options={[
                                    { value: "opt1", label: "Option 1" },
                                    { value: "opt2", label: "Option 2" },
                                    { value: "opt3", label: "Option 3" },
                                ]}
                            />
                        </div>
                        <div className="space-y-6">
                            <Select
                                label="Searchable Select"
                                searchable
                                options={[
                                    { value: "tx", label: "Texas" },
                                    { value: "ca", label: "California" },
                                    { value: "ny", label: "New York" },
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Cards Section */}
                <section className={styles.section} style={{ paddingTop: 0 }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Containers</span>
                        <h2 className={styles.sectionTitle}>Cards</h2>
                        <p className={styles.sectionDescription}>
                            Cards group related content. Use the elevated variant for main content and outlined for secondary information.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>Background: Surface</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Standard card content area.
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="secondary">Action</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>Shadow: MD</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Elevated card for higher hierarchy.
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="primary">Action</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="outlined">
                            <CardHeader>
                                <CardTitle>Outlined Card</CardTitle>
                                <CardDescription>Background: Transparent</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Outlined card for secondary content.
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="ghost">Action</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

            </div>
        </div>
    );
}
