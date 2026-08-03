import { cn } from "@/lib/utils";

type LogoType = {
	src: string;
	alt: string;
	isInvertable?: boolean;
};

type TileData = {
	row: number;
	col: number;
	logo?: LogoType;
};

export function Integrations() {
	return (
		<section className="bg-background py-24">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:items-center">
				{/* Left Content */}
				<div className="max-w-xl space-y-5 text-center md:text-left mx-auto md:mx-0">
					<h2 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-foreground">
						Extend Your LMS Ecosystem
					</h2>
					<p className="font-serif text-muted-foreground md:text-lg leading-8">
						Only Students connects seamlessly with your favorite educational tools. Import course materials, sync assignments, and manage your entire learning environment from one unified platform.
					</p>
				</div>

				{/* Right Content - Visual */}
				<div className="w-full overflow-hidden flex justify-center md:justify-end py-4">
					<div className="mask-[radial-gradient(ellipse_at_center,black,black,transparent)] relative size-[360px] scale-[0.85] sm:scale-100 origin-center md:origin-right shrink-0">
						{tiles.map((tile) => (
							<IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function IntegrationCard({ row, col, logo }: TileData) {
	return (
		<div
			className={cn(
				"absolute flex size-18 items-center justify-center rounded-md border-2 border-border",
				logo
					? "bg-card shadow-sm dark:bg-card/60"
					: "bg-secondary/30 dark:bg-background" // Styling for empty tiles
			)}
			style={{
				left: col * 72, // 72px cell
				top: row * 72,
			}}
		>
			{logo && (
				<img
					alt={logo.alt}
					className={cn(
						"pointer-events-none size-8 select-none object-contain p-1",
						logo.isInvertable && "dark:invert"
					)}
					height={40}
					src={logo.src}
					width={40}
				/>
			)}
		</div>
	);
}

// Coordinate mapping to approximate the "scattered" look in the image.
// Grid 5x5.
const tiles: TileData[] = [
	// Row 0
	{
		row: 0,
		col: 1,
	},
	{
		row: 0,
		col: 3,
		logo: {
			src: "https://cdn.simpleicons.org/notion",
			alt: "Notion Logo",
            isInvertable: true,
		},
	},

	// Row 1
	{ row: 1, col: 0 }, // Empty
	{
		row: 1,
		col: 2,
		logo: {
			src: "https://cdn.simpleicons.org/googledrive",
			alt: "Google Drive Logo",
		},
	},
	{
		row: 1,
		col: 4,
		logo: {
			src: "https://cdn.simpleicons.org/zoom",
			alt: "Zoom Logo",
		},
	},

	// Row 2
	{
		row: 2,
		col: 1,
		logo: {
			src: "https://cdn.jsdelivr.net/npm/simple-icons@10/icons/slack.svg",
			alt: "Slack Logo",
			isInvertable: true,
		},
	},
	{
		row: 2,
		col: 3,
		logo: {
			src: "https://cdn.simpleicons.org/gmail",
			alt: "Gmail Logo",
		},
	}, // Empty

	// Row 3

	{ row: 3, col: 0 }, // Empty
	{
		row: 3,
		col: 2,
		logo: {
			src: "https://cdn.simpleicons.org/dropbox",
			alt: "Dropbox Logo",
		},
	},
	{
		row: 3,
		col: 4,
		logo: {
			src: "https://cdn.jsdelivr.net/npm/simple-icons@10/icons/canva.svg",
			alt: "Canva Logo",
			isInvertable: true,
		},
	},

	// Row 4
	{
		row: 4,
		col: 1,
		logo: {
			src: "https://cdn.jsdelivr.net/npm/simple-icons@10/icons/microsoftteams.svg",
			alt: "Microsoft Teams Logo",
			isInvertable: true,
		},
	},
	{
		row: 4,
		col: 3,
		logo: {
			src: "https://cdn.simpleicons.org/moodle",
			alt: "Moodle Logo",
		},
	},
];
