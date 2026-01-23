import styles from './brand.module.css';

export function ColorSwatch({ name, value, token, light }: {
  name: string;
  value: string;
  token: string;
  light?: boolean;
}) {
  return (
    <div className={styles.colorSwatch}>
      <div
        className={styles.swatchColor}
        style={{
          background: value,
          border: light ? '1px solid var(--color-border)' : 'none'
        }}
      />
      <div className={styles.swatchInfo}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchValue}>{value}</span>
        <code className={styles.swatchToken}>{token}</code>
      </div>
    </div>
  );
}

export function TypeSample({ label, size, token, sample, font, uppercase }: {
  label: string;
  size: string;
  token: string;
  sample: string;
  font: 'display' | 'body';
  uppercase?: boolean;
}) {
  return (
    <div className={styles.typeItem}>
      <div className={styles.typeLabel}>
        <span className={styles.typeLabelName}>{label}</span>
        <span className={styles.typeLabelSize}>{size}</span>
      </div>
      <div
        className={styles.typeSample}
        style={{
          fontFamily: font === 'display' ? 'var(--font-display)' : 'var(--font-body)',
          fontSize: `var(${token})`,
          textTransform: uppercase ? 'uppercase' : 'none',
          letterSpacing: uppercase ? 'var(--tracking-wider)' : 'inherit'
        }}
      >
        {sample}
      </div>
      <code className={styles.typeToken}>{token}</code>
    </div>
  );
}

export function SpacingSample({ size, token }: { size: string; token: string }) {
  return (
    <div className={styles.spacingItem}>
      <div
        className={styles.spacingBox}
        style={{ width: size, height: size }}
      />
      <div className={styles.spacingInfo}>
        <span className={styles.spacingSize}>{size}</span>
        <code className={styles.spacingToken}>{token}</code>
      </div>
    </div>
  );
}
