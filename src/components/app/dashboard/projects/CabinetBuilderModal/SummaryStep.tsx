import { Cabinet } from '@/constants/models/object.types';


interface SummaryStepProps {
    inputs: Partial<Cabinet>;
    spacePhotos: FilePreview[];
    inspirationPhotos: FilePreview[];
    toUSD: (price: number) => string;
    customOptions: any[] | undefined;
    cabinet: Cabinet | undefined;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
    inputs,
    spacePhotos,
    inspirationPhotos,
    toUSD,
    customOptions,
    cabinet,
}) => {
    // For brevity, reuse the same logic to calculate the total summary
    const widthSummary = parseFloat(inputs.width ?? cabinet?.width?.toString() ?? '0');
    const lengthSummary = parseFloat(inputs.length ?? cabinet?.length?.toString() ?? '0');
    const dimensionMultiplier = widthSummary * lengthSummary || 1;

    const findValue = (field: string) => {
        const option = customOptions?.find((opt) =>
            opt.id === (inputs[field as keyof typeof inputs] || cabinet?.[field as keyof Cabinet])
        );
        return parseFloat(option?.value || '0');
    };

    const total =
        (findValue('doorMaterial') +
            findValue('subMaterial') +
            findValue('constructionMethod') +
            findValue('toeStyle') +
            findValue('crown') +
            findValue('lightRail') +
            findValue('ceilingHeight')) *
        dimensionMultiplier;

    return (
        <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="text-muted">Review your cabinet configuration.</p>
            <pre className="text-left text-sm bg-muted p-4 rounded-md">
                {JSON.stringify({ ...inputs, spacePhotos, inspirationPhotos }, null, 2)}
            </pre>
            <h3 className="text-lg font-bold text-primary">Total Price: {toUSD(total)}</h3>
        </div>
    );
};
export default SummaryStep;