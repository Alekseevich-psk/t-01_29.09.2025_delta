import zingchart from "zingchart";

(function () {

    const parent: HTMLElement | null = document.querySelector('.main');
    if (parent === null) return;

    const rows: NodeList = parent.querySelectorAll('.table__row');
    const wrappersChart: NodeList = parent.querySelectorAll('.table__cell--chart');

    const getNumber = (value: HTMLElement) => {
        return Number(value.innerHTML.replace(/[^0-9.-]/g, ""));
    };

    const getDiffValue = (wrapper) => {
        const todayValue = wrapper.querySelector('.table__cell--today') as HTMLElement | null;
        const yesterdayValue = wrapper.querySelector('.table__yesterday-value') as HTMLElement | null;

        if (todayValue === null || yesterdayValue === null) return;

        const numToday = getNumber(todayValue);
        const numYesterday = getNumber(yesterdayValue);

        const percentage = ((numToday - numYesterday) / numYesterday) * 100;
        const diff = numToday - numYesterday;
        const diffValue = diff === 0 ? '0' : (diff > 0 ? `+` : `-`);

        return diffValue + Math.round(percentage) + "%";
    };


    const closeWrapperCharts = () => {
        if (wrappersChart.length > 0) {
            wrappersChart.forEach(element => {
                const el = element as HTMLElement;

                el.innerHTML = '';

                if (el.classList.contains('active')) {
                    el.classList.remove('active');
                }
            });
        }
    };

    const initChart = (wrapper) => {
        wrapper.classList.add('active');

        zingchart.render({
            id: wrapper.id,
            data: {
                type: 'line',
                series: [
                    { values: [54, 23, 34, 23] },
                ]
            }
        });

        const chartJs = wrapper.querySelector('.zc-rel') as HTMLElement | null;
        const btnHTML = `<button class="table__btn-close" type="button"></button>`;

        if (chartJs !== null) {
            chartJs.insertAdjacentHTML('afterbegin', btnHTML);
            chartJs.style.opacity = '0';

            setTimeout(() => {
                chartJs.style.opacity = '1';
            }, 600);
        }

        const btnClose = wrapper.querySelector('.table__btn-close') as HTMLElement | null;

        if (btnClose !== null) {
            btnClose.addEventListener('click', (event) => {
                event.stopPropagation();
                return closeWrapperCharts();
            });
        }

    };

    if (rows.length > 0) {
        rows.forEach((row, index) => {
            const el = row as HTMLElement;

            const wrapChart = el.querySelector('.table__cell--chart') as HTMLElement | null;
            const diffValue = el.querySelector('.table__diff-value') as HTMLElement | null;

            if (diffValue !== null) {
                diffValue.innerHTML = String(getDiffValue(el));
            }

            if (wrapChart === null) return;

            el.addEventListener('click', (event) => {
                if (event.target instanceof HTMLElement) {

                    if (event.target.classList.contains("table__cell--title")) return;
                    closeWrapperCharts();

                    if (wrapChart !== null) {
                        initChart(wrapChart);
                    }
                }
            });
        });
    }

}());