import MigrationBanner from "./styles/MigrationBanner";

export default function MigrateToV2() {
    return (
        <MigrationBanner>
            <div className="blank" />
            <p className="banner-message">Boost your treasury ops with early access to Coinshift V2. {" "}
                <a className="banner-link" href="https://beta.coinshift.xyz" target="__blank" rel="noopener noreferrer">Go to Coinshift V2</a>
                </p>

                <a className="banner-link small" href="https://docs.coinshift.xyz" target="__blank" rel="noopener noreferrer">Need help?</a>
        </MigrationBanner>
    )
}
